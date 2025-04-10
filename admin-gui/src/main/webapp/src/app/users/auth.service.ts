import {Observable, of as observableOf} from 'rxjs';

import {catchError, finalize, map} from 'rxjs/operators';

/**
 * Created by Xu on 03.05.2017.
 *
 * User Service
 */
import {Injectable} from '@angular/core';

import {CleanUpAuthService, HttpService, StorageService, UrlService} from '../helpers';
import {User} from './user';
import {Permission} from './index';

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

    constructor(
        private _http: HttpService,
        private _urls: UrlService,
        private _store: StorageService,
        private _cleanUp: CleanUpAuthService,
    ) {
    }

    redirect2Home(url?: string): void {
        return this._cleanUp.redirect2Home(url);
    }

    redirect2Route() {
        return this._cleanUp.redirect2Route();
    }

    userLogin(username: string, password: string): Observable<User> {
        this._cleanUp.cleanUpStorage();
        return this._http.post(
            this._urls.parse('login'),
            {username: username, password: password},
            {responseType: 'text'}
        ).pipe(map(token => {
            if (!!token) {
                const user = new User(username, token);
                this._store.setValue('user.auth.time', String(Date.now()));
                this._store.setValue('user.name', user.username);
                this._store.setValue('user.token', user.token);
                this.adminCheck().subscribe();
                this.setPermissions().subscribe();
                return user;
            }
            throw new Error('Authentication Error');//, status code: ' + res.status);
        }), catchError((err) => {
            return this._http.handleError(err);
        }),);
    }

    userLogout(): Observable<boolean> {
        return this._http.post<string>(
            this._urls.parse('logout'),
            this._store.getValue('user.token'),
            {headers: this._http.generateHeaderOptions('Content-Type', 'text/plain')}
        ).pipe(map(res => {
                console.log('token valid for ' + res.split('=')[1].split('}')[0] + 'ms');
                this._cleanUp.cleanUpStorage();
                return true;
            }),
            finalize(() => {
                sessionStorage.removeItem('permissions');
                this._cleanUp.cleanUpStorage();
                this._cleanUp.redirect2Home('');
            }),);
    }

    authCheck(): Observable<boolean> {
        return this._http.debouncedGet<boolean>(
            'user.auth',
            this._store.getValue('user.token') !== null,
            false,
            this._tokenValidTrustTime,
            this._urls.parse('authCheck'),
            res => {
                this.adminCheck().subscribe();
                return this._store.getValue('user.token') !== null;
            },
            err => {
                sessionStorage.removeItem('permissions');
                this._cleanUp.cleanUpStorage();
                this._cleanUp.redirect2Home();
                return err;
            },
        );
    }

    adminCheck(): Observable<boolean> {
        return this._http.debouncedGet<boolean>(
            'user.admin',
            JSON.parse(this._store.getValue('user.admin') || 'false'),
            false,
            this._tokenValidTrustTime,
            this._urls.parse('adminCheck'),
            res => {
                this._store.setValue('user.admin', res.toString());
                return res;
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    sessionStorage.removeItem('permissions');
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
    userRoles(): Observable<string[]> {
        return this._http.debouncedGet<any>(
            'user.roles',
            JSON.parse(this._store.getValue('user.roles') || '[]'),
            null,
            this._tokenValidTrustTime,
            this._urls.parse('getUserRoles', {user: this._store.getValue('user.name')}),
            res => {
                this._store.setValue('user.roles', res);
                return JSON.parse(res || '[]');
            }, err => {
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
    userRolesCheck(roles: string[]): Observable<boolean> {
        return this.userRoles().pipe(map(
            userRoles => { // at least one role is in userRoles
                return roles.some(function (role) {
                    return userRoles.includes(role);
                });
            }
        ));
    }

    userRolesCheckFull(roles: string[]): Observable<boolean> {

        // require admin role (if passed indicates user!) ADMIN is GOD. ADMIN trumps all roles
        if (roles.includes('ADMIN')) {
            return this.adminCheck();
        }
        // only require logged in!
        if (roles.includes('LOGGEDIN')) {
            return this.authCheck();
        }

        // roles not working yet ...
        // return this.userRolesCheck(roles);
        return observableOf(true);
    }

    /**
     * get local user
     * @returns {User}
     */
    userLocal(): User {
        if (this.userLocalCheck()) {
            if (this._store.getValue('user.name') === null) {
                // some thing went wrong. user name error. we will wipe it then
                sessionStorage.removeItem('permissions');
                this._cleanUp.cleanUpStorage();
            }
            return new User(this._store.getValue('user.name'), this._store.getValue('user.token'));
        }
        return null;
    }

    /**
     * whether there is a user locally
     * @returns {boolean}
     */
    userLocalCheck(): boolean {
        return this._store.getValue('user.token') !== null;
    }

    /**
     * Get permissions from server depending on user role and writes them to the sessionStorage.
     */
    setPermissions() {
        return this._http.get<string>(this._urls.parse('permissions')).pipe(
            map(res => {
                sessionStorage.setItem('permissions', res);
            }));
    }

    // IMPROVE: better way than using sessionStorage?
    /**
     * Check permissions by comparing the given values with the values in the sessionStorage.
     */
    userLocalCheckPermissions(checkPermissions: Permission[]): boolean {
        if (!checkPermissions || checkPermissions.length === 0) {
            return true;
        }
        if (sessionStorage.getItem('permissions') === null) {
            return false;
        }
        let perm: Permission[] = [];
        sessionStorage.getItem('permissions').split(',').forEach(function (p: String) {
            perm.push(Permission[p as keyof typeof Permission]);
        });
        for (let i = 0; i < checkPermissions.length; i++) {
            if (perm.indexOf(checkPermissions[i]) !== -1) {
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
    userLocalCheckRoles(roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return true;
        }
        if (roles.includes('ADMIN')) {
            if (this._store.getValue('user.token') !== null) {
                return JSON.parse(this._store.getValue('user.admin')) || false;
            }
            sessionStorage.removeItem('permissions');
            this._cleanUp.cleanUpStorage();
            // this._cleanUp.redirect2Home();
            return false;
        }
        if (roles.includes('LOGGEDIN')) {
            return this._store.getValue('user.token') !== null;
        }
        let userRoles = JSON.parse(this._store.getValue('user.roles'));
        return roles.some(role => {
            return userRoles.contains(role);
        });
    }

}
