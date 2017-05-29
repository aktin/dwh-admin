/**
 * Created by Xu on 03.05.2017.
 *
 * User Service
 */
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/combineLatest';

import _ = require('underscore');

import { HttpHandlerService, StorageService, UrlService, HttpInterceptorService } from '../helpers/index';

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

    private tokenValidTrustTime: number = 3000;

    constructor (
        private httpHandler: HttpHandlerService,
        private http: HttpInterceptorService,
        private urls: UrlService,
        private store: StorageService
    ) {}

    private cleanUpStorage (): void {
        this.store.clear();
    }

    userLogin ( username: string, password: string): Observable<User> {
        // console.log('login',  this.urls.parse('login'));
        this.cleanUpStorage();
        return this.http.post(
            this.urls.parse('login'),
            {username: username, password: password}
        ).map(res => {
            let user: User;
            if (res.ok && res.text()) {
                user = new User(username, res.text());
                this.store.setValue('user.auth.time', String(Date.now()));
                this.store.setValue('user.name', user.username);
                this.store.setValue('user.token', user.token);
                this.adminCheck().subscribe();
                return user;
            }
            return Observable.throw('Authentication Error, status code: ' + res.status);
        }).catch(this.httpHandler.handleError);
    }

    userLogout (): Observable<boolean> {
        return this.http.post(
            this.urls.parse('logout'),
            this.store.getValue('user.token'),
            new RequestOptions({ headers: new Headers({ 'Content-Type': 'text/plain' }) })
        ).map(res => {
            console.log('token valid for ' + res.text().split('=')[1].split('}')[0] + 'ms');
            this.cleanUpStorage();
            return true;
        })//.catch(this.httpHandler.handleError)
        .finally(() => {
            this.cleanUpStorage();
        });
    }

    userCheck (): Observable<boolean>  {
        return this.httpHandler.debouncedGet<boolean> (
            'user.auth',
            this.store.getValue('user.token') !== null,
            false,
            this.tokenValidTrustTime,
            this.urls.parse('userCheck'),
            (res: Response) => {
                // console.log(res);
                this.adminCheck().subscribe();
                return this.store.getValue('user.token') !== null;
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    this.cleanUpStorage();
                }
                return err;
            }, this.http, this.store
        );
    }

    adminCheck (): Observable<boolean> {
        return this.httpHandler.debouncedGet<boolean> (
            'user.admin',
            JSON.parse(this.store.getValue('user.admin') || 'false'),
            false,
            this.tokenValidTrustTime,
            this.urls.parse('adminCheck'),
            (res: Response) => {
                this.store.setValue('user.admin', res.text());
                return res.text() === 'true';
            }, (err: Response) => {
                if (err.status === 401) {
                    // console.log('unauthorized');
                    this.cleanUpStorage();
                }
                return err;
            }, this.http, this.store
        );
    }

    userRoles (): Observable<string[]> {
        return this.httpHandler.debouncedGet<string[]> (
            'user.roles',
            JSON.parse(this.store.getValue('user.roles') || '[]'),
            null,
            this.tokenValidTrustTime,
            this.urls.parse('getUserRoles', {user: this.store.getValue('user.name')}),
            (res: Response) => {
                this.store.setValue('user.roles', res.text());
                return JSON.parse(res.text() || '[]');
            }, (err: Response) => {
                if (err.status === 401) {
                    console.log('unauthorized in roles', err);
                    // this.cleanUpStorage();
                }
                return err;
            }, this.http, this.store
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
            if (this.store.getValue('user.name') === null) {
                // some thing went wrong. user name error. we will wipe it then
                this.cleanUpStorage();
            }
            return new User (this.store.getValue('user.name'), this.store.getValue('user.token'));
        }
        return null;
    }

    userLocalCheck (): boolean {
        return this.store.getValue('user.token') !== null;
    }

    userLocalCheckRoles (roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return true;
        }
        if (_.contains(roles, 'ADMIN')) {
            if ( this.store.getValue('user.token') !== null ) {
                return JSON.parse(this.store.getValue('user.admin')) || false;
            }
            this.cleanUpStorage();
            return false;
        }
        if (_.contains(roles, 'LOGGEDIN')) {
            return  this.store.getValue('user.token') !== null;
        }
        let userRoles = JSON.parse(this.store.getValue('user.roles'));
        return _.some(roles, function (role) {
            return _.contains(userRoles, role);
        });
    }

    users (): Observable<User[]> {
        return this.http.get(this.urls.parse('getRoles', {user: 'i2b2'})).map(
            res => {
                console.log(res);
                return null;
            }).catch(err => {
            return this.httpHandler.handleError(err);
        });
    }
}
