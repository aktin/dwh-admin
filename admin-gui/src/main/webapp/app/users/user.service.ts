/**
 * Created by Xu on 03.05.2017.
 *
 * User Service
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';




import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { User } from './user';

/**
 * Service Class for user management
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class UserService {

    private _dataInterval = 3000;

    constructor(private _http: HttpInterceptorService,
                private _urls: UrlService,
                private _store: StorageService,
                private _router: Router) {
    }

    private _updateUsers (): void {
        this._http.debouncedGet<User[]> (
            'users',
            null, null,
            this._dataInterval,
            this._urls.parse('getUsers'),
            (res: Response) => {
                // console.log(res);
                return _.map(res.json(), rawUser => {
                    return User.parse(rawUser['full_name'],
                        rawUser['user_name'],
                        rawUser['email'],
                        rawUser['is_admin'],
                    );
                });
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            users => {
                if (users) {
                    this._updateUserRoles(users);
                }
            },
            error => console.log(error)
        );
    }

    private _updateUserRoles (users: User[]): void {
        this._http.debouncedGet<any[]> (
            'users.roles',
            null, null,
            this._dataInterval,
            this._urls.parse('getRoles'),
            (res: Response) => {
                return res.json();
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            rawRoles => {
                let roleObj = {};
                if (rawRoles) {
                    _.each(rawRoles, (r: any) => {
                        let name = r['user_name'];
                        let role = r['role'];
                        if (!roleObj.hasOwnProperty(name)) {
                            roleObj[name] = [];
                        }
                        roleObj[name].push(role);
                    });
                }
                _.each(users, (user: User) => {
                    if (roleObj.hasOwnProperty(user.username) && roleObj[user.username].length > 0) {
                        user.roles = roleObj[user.username];
                    }
                });
                this._store.setValue('users.data', JSON.stringify(users));
            },
            error => console.log(error)
        );
    }

    users(): User[] {
        this._updateUsers();

        return _.map(JSON.parse(this._store.getValue('users.data')), user => {
            return <User> user;
        });
    }

    getUser (username: string): User {
        let users: User[] = this.users();

        if (!users || !username) {
            this._router.navigate(['/users']);
            return null;
        }
        let user = _.find(users, (u) => u.username === username);
        if (user) {
            return user;
        }
        this._router.navigate(['/users']);
        return null;
    }

}
