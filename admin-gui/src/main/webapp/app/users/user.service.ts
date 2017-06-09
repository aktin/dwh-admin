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

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';

import { User } from './user';

/**
 * Service Class for user management and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class UserService {

    private _tokenValidTrustTime = 3000;

    constructor (
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService,
        private _router: Router
    ) {}

    private cleanUpStorage (): void {
        this._store.clear();
    }

    private redirect2Home (): void {
        console.log('redirect')
        this._router.navigate(['']);
    }

    userLogin ( username: string, password: string): Observable<User> {
        // console.log('login',  this._urls.parse('login'));
        this.cleanUpStorage();
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
                this.adminCheck().subscribe();
                return user;
            }
            return Observable.throw('Authentication Error, status code: ' + res.status);
        }).catch(this._http.handleError);
    }

    userLogout (): Observable<boolean> {
        return this._http.post(
            this._urls.parse('logout'),
            this._store.getValue('user.token'),
            this._http.generateHeaderOptions('Content-Type', 'text/plain')
        ).map(res => {
            console.log('token valid for ' + res.text().split('=')[1].split('}')[0] + 'ms');
            this.cleanUpStorage();
            return true;
        })
        // .catch(this._http.handleError)
        .finally(() => {
            this.cleanUpStorage();
            // this.redirect2Home();
        });
    }

    userCheck (): Observable<boolean>  {
        return this._http.debouncedGet<boolean> (
            'user.auth',
            this._store.getValue('user.token') !== null,
            false,
            this._tokenValidTrustTime,
            this._urls.parse('userCheck'),
            ( /*res: Response*/ ) => {
                // console.log(res);
                this.adminCheck().subscribe();
                return this._store.getValue('user.token') !== null;
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    this.cleanUpStorage();
                    this.redirect2Home();
                }
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
                    this.cleanUpStorage();
                    this.redirect2Home();
                }
                return err;
            },
        );
    }

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
                    // this.cleanUpStorage();
                }
                return err;
            },
        );
    }

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
            return this.userCheck();
        }

        // roles not working yet ...
        // return this.userRolesCheck(roles);
        return Observable.of(true);
    }

    userLocal (): User {
        if (this.userLocalCheck()) {
            if (this._store.getValue('user.name') === null) {
                // some thing went wrong. user name error. we will wipe it then
                this.cleanUpStorage();
            }
            return new User (this._store.getValue('user.name'), this._store.getValue('user.token'));
        }
        return null;
    }

    userLocalCheck (): boolean {
        return this._store.getValue('user.token') !== null;
    }

    userLocalCheckRoles (roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return true;
        }
        if (_.contains(roles, 'ADMIN')) {
            if ( this._store.getValue('user.token') !== null ) {
                return JSON.parse(this._store.getValue('user.admin')) || false;
            }
            this.cleanUpStorage();
            // this.redirect2Home();
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

    users (): Observable<User[]> {
        return this._http.get(this._urls.parse('getUsers', {user: 'i2b2'})).map(
            res => {
                console.log(res);
                return null;
            }).catch(err => {
            return this._http.handleError(err);
        });
        // "[
        // {"full_name":"i2b2 Admin","user_name":"i2b2","email":null,"password":null,"is_admin":true},
        // {"full_name":"AGG_SERVICE_ACCOUNT","user_name":"AGG_SERVICE_ACCOUNT","email":null,"password":null,"is_admin":false},
        // {"full_name":"i2b2 User","user_name":"demo","email":null,"password":null,"is_admin":false}
        // ]"
    }
}
