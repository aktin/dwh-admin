/**
 * Created by Xu on 06.04.2017.
 *
 * User Component
 */
import {Component} from '@angular/core';

import {UserService} from './user.service';
import {User} from './user';

/**
 * TODO implement once API is open
 */
@Component({
  templateUrl: './users.component.html',
})
export class UsersComponent {
    usersData: User[];

    constructor ( private _userService: UserService ) {}

    get users(): User[] {
        this.usersData = this._userService.users();
        return this.usersData;
    }
}
