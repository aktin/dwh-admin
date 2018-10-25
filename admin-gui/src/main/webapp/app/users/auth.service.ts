
/**
 * Created by Xu on 03.05.2017.
 *
 * User Service
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/combineLatest';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService, CleanUpAuthService } from '../helpers/index';
import { routings } from '../app-routing.module';
import { User } from './user';
import { Role, Permissions } from './roles';

// TODO: wenn i2b2-admin, dann automatisch aktin-admin

/**
 * Service Class for AUTH and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class AuthService {

    private _tokenValidTrustTime = 3000;
    // private _visibility: any = {};
    // private _aktinRole: Role;
    // private _roleIsAuthorized = false;

    constructor (
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService,
        private _cleanUp: CleanUpAuthService,
    ) {}

    redirect2Home (url?: string): void {
        return this._cleanUp.redirect2Home(url);
    }
    redirect2Route () {
        return this._cleanUp.redirect2Route();
    }

    userLogin ( username: string, password: string): Observable<User> {
        this._cleanUp.cleanUpStorage();
        return this._http.post(
            this._urls.parse('login'),
            {username: username, password: password}
        ).map(res => {
            let user: User;
            if (res.ok && res.text()) {
                user = new User(username, res.text());
                this._store.setValue('user.auth.time', String(Date.now()));
                this._store.setValue('user.name', user.username);
                this._store.setValue('user.token', user.token);
                this._http.get(this._urls.parse('aktinRole')).subscribe(role => { this._store.setValue('user.role', role.text()) });
                this.adminCheck().subscribe();
               // this.setVisibility();
                return user;
            }
            return Observable.throw('Authentication Error, status code: ' + res.status);
        }).catch( (err) =>  {
            return this._http.handleError(err);
        });
    }

    userLogout (): Observable<boolean> {
        return this._http.post(
            this._urls.parse('logout'),
            this._store.getValue('user.token'),
            this._http.generateHeaderOptions('Content-Type', 'text/plain')
        ).map(res => {
            console.log('token valid for ' + res.text().split('=')[1].split('}')[0] + 'ms');
            this._cleanUp.cleanUpStorage();
            return true;
        })
        // .catch(this._http.handleError)
        .finally(() => {
            this._cleanUp.cleanUpStorage();
            this._cleanUp.redirect2Home('');
            // this._aktinRole = null;
        });
    }

    authCheck (): Observable<boolean>  {
        return this._http.debouncedGet<boolean> (
            'user.auth',
            this._store.getValue('user.token') !== null,
            false,
            this._tokenValidTrustTime,
            this._urls.parse('authCheck'),
            ( /*res: Response*/ ) => {
                // console.log(res);
                this.adminCheck().subscribe();
                return this._store.getValue('user.token') !== null;
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    this._cleanUp.cleanUpStorage();
                    this._cleanUp.redirect2Home();
                }
                this._cleanUp.cleanUpStorage();
                this._cleanUp.redirect2Home();
                return err;
            },
        );
    }

    adminCheck (): Observable<boolean> {
        return this._http.debouncedGet<boolean> (
            'user.admin',
            JSON.parse(this._store.getValue('user.admin') || 'false'),
            false,
            this._tokenValidTrustTime,
            this._urls.parse('adminCheck'),
            (res: Response) => {
                this._store.setValue('user.admin', res.text());
                return res.text() === 'true';
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    this._cleanUp.cleanUpStorage();
                    this._cleanUp.redirect2Home();
                }
                return err;
            },
        );
    }

    /**
     * get user roles from server.
     * @returns {Observable<string[]>}
     */
    userRoles (): Observable<string[]> {
        return this._http.debouncedGet<string[]> (
            'user.roles',
            JSON.parse(this._store.getValue('user.roles') || '[]'),
            null,
            this._tokenValidTrustTime,
            this._urls.parse('getUserRoles', {user: this._store.getValue('user.name')}),
            (res: Response) => {
                this._store.setValue('user.roles', res.text());
                return JSON.parse(res.text() || '[]');
            }, (err: Response) => {
                if (err.status === 401) {
                    console.log('unauthorized in roles', err);
                    // this._cleanUp.cleanUpStorage();
                }
                return err;
            },
        );
    }

    /**
     * check whether the current user has one of the given roles.
     * @param {string[]} roles
     * @returns {Observable<boolean>}
     */
    userRolesCheck (roles: string[]): Observable<boolean> {
        return this.userRoles().map(
            userRoles => { // at least one role is in userRoles
                return _.some(roles, function (role) {
                    return _.contains(userRoles, role);
                });
            }
        );
    }

    userRolesCheckFull (roles: string[]): Observable<boolean> {

        // require admin role (if passed indicates user!) ADMIN is GOD. ADMIN trumps all roles
        if (_.contains(roles, 'ADMIN')) {
            return this.adminCheck();
        }
        // only require logged in!
        if (_.contains(roles, 'LOGGEDIN')) {
            return this.authCheck();
        }

        // roles not working yet ...
        // return this.userRolesCheck(roles);
        return Observable.of(true);
    }

    /**
     * get local user
     * @returns {User}
     */
    userLocal (): User {
        if (this.userLocalCheck()) {
            if (this._store.getValue('user.name') === null) {
                // some thing went wrong. user name error. we will wipe it then
                this._cleanUp.cleanUpStorage();
            }
            return new User (this._store.getValue('user.name'), this._store.getValue('user.token'));
        }
        return null;
    }

    /**
     * whether there is a user locally
     * @returns {boolean}
     */
    userLocalCheck (): boolean {
        return this._store.getValue('user.token') !== null;
    }

    // getRole(): Observable<void> {
    //     // if (this.userLocalCheck()) {
    //     //     // this.userRoles().subscribe(ur => {
    //     //         // if (ur.indexOf('admin') !== -1) {
    //     //         //     this._aktinRole = new Role('admin');
    //     //         // } else {
    //     //             return this._http.get(this._urls.parse('aktinRole'))
    //     //                 .map(role => { this._aktinRole = new Role(role.text()); });
    //     //         // }
    //     //     // });
    //     //     // if (this.userLocalCheck()) {
    //     //     //     this.redirect2Route();
    //     //     // } else {
    //     //     //     this.redirect2Home();
    //     //     // }
    //     // }
    //     // return Observable.of(null);
    //     return this._http.get(this._urls.parse('aktinRole'))
    //                      .map(role => { this._store.setValue('aktinRole', role.text()) });
    //     // this._store.setValue('aktinRole', 'admin');
    //     // return Observable.of();
    // }

    // userLocalCheckPermissions(checkPermissions: Permissions[]): boolean {
    //     // console.log("aktinRole: " + this._aktinRole.rolename);
    //     // this.setRole();
    //     console.log("checkPermissions");
    //     if (!checkPermissions || checkPermissions.length === 0) {
    //         return true;
    //     }
    //     if (this._aktinRole === undefined || this._aktinRole === null) {
    //         console.log("before subscribe");
    //         this.getRole().subscribe(res => { console.log(res);
    //             console.log(this._aktinRole);
    //             if (this._aktinRole) {
    //                 for (let i = 0; i < checkPermissions.length; i++) {
    //                     console.log(checkPermissions[i]);
    //                     console.log(this._aktinRole.getPermissions().indexOf(checkPermissions[i]) !== -1 );
    //                     if (this._aktinRole.getPermissions().indexOf(checkPermissions[i]) !== -1) {
    //                         this._roleIsAuthorized = true;
    //                     }
    //                 }
    //             }
    //             this._roleIsAuthorized = false;
    //         });
    //     } else {
    //         for (let i = 0; i < checkPermissions.length; i++) {
    //             if (this._aktinRole.getPermissions().indexOf(checkPermissions[i]) !== -1) {
    //                 this._roleIsAuthorized = true;
    //             }
    //         }
    //     }
    //     console.log(this._roleIsAuthorized);
    //     return this._roleIsAuthorized;
    // }

    userLocalCheckPermissions(checkPermissions: Permissions[]): boolean {
        if (!checkPermissions || checkPermissions.length === 0) {
            return true;
        }
        if (this._store.getValue('user.role') === null) {
            return false;
        }
        let role = new Role(this._store.getValue('user.role'));
        for (let i = 0; i < checkPermissions.length; i++) {
            if (role.getPermissions().indexOf(checkPermissions[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * check local user roles
     * @param {string[]} roles
     * @returns {boolean}
     */
    userLocalCheckRoles (roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return true;
        }
        if (_.contains(roles, 'ADMIN')) {
            if ( this._store.getValue('user.token') !== null ) {
                return JSON.parse(this._store.getValue('user.admin')) || false;
            }
            this._cleanUp.cleanUpStorage();
            // this._cleanUp.redirect2Home();
            return false;
        }
        if (_.contains(roles, 'LOGGEDIN')) {
            return  this._store.getValue('user.token') !== null;
        }
        let userRoles = JSON.parse(this._store.getValue('user.roles'));
        return _.some(roles, function (role) {
            return _.contains(userRoles, role);
        });
    }

    // setVisibility() {
    //     _.each(routings, route => {
    //         this._visibility[route.data['name']] = this.userLocalCheckPermissions(route.data['permissions']);
    //         if (route.hasOwnProperty('children')) {
    //             let children = route.children;
    //             for (let i = 0; i < children.length; i++) {
    //                 if (children[i].hasOwnProperty('data') && children[i].data.hasOwnProperty('name')) {
    //                     this._visibility[children[i].data['name']] = this.userLocalCheckPermissions(children[i].data['permissions']);
    //                 }
    //             }
    //         }
    //     });
    // }

    // getVisibility() {
    //     return this._visibility;
    // }

}
