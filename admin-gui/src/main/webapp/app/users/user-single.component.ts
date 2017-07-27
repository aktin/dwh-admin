/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { User } from './user';
import { UserService } from './user.service';
@Component({
    templateUrl: './user-single.component.html',
})
export class UserSingleComponent implements OnInit {
    user: User;

    constructor(
        private _route: ActivatedRoute,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
                return this._userService.getUser(params['username']);
            }).subscribe(
            u => {
                if (u) {
                    this.user = u;
                }
            }
        );
    }
}
