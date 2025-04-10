/**
 * Created by Xu on 03.05.2017.
 *
 * User Service
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {HttpService, StorageService, UrlService} from '../helpers/index';
import {User} from './user';

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

    constructor(private _http: HttpService,
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
            res => {
                // console.log(res);
                return res.map((rawUser: any) => {
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
            res => res
        ).subscribe(
            rawRoles => {
                let roleObj: any = {};
                if (rawRoles) {
                    rawRoles.forEach((r: any) => {
                        let name = r['user_name'];
                        let role = r['role'];
                        if (!roleObj.hasOwnProperty(name)) {
                            roleObj[name] = [];
                        }
                        roleObj[name].push(role);
                    });
                }
                users.forEach((user: User) => {
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

        return JSON.parse(this._store.getValue('users.data'));
    }

    getUser (username: string): User {
        let users: User[] = this.users();

        if (!users || !username) {
            this._router.navigate(['/users']);
            return null;
        }
        let user = users.find(u => u.username === username);
        if (user) {
            return user;
        }
        this._router.navigate(['/users']);
        return null;
    }

}
