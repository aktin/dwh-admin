/**
 * Created by Xu on 06.04.2017.
 *
 * User Component
 */
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  template: `<h1>Hello Users</h1>`,
})
export class UsersComponent implements OnInit{
    constructor (private userService: UserService) {}

    ngOnInit (): void {
        // this.userService.users().subscribe();
    }
}
