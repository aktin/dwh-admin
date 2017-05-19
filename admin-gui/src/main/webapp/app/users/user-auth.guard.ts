/**
 * Created by Xu on 28.04.2017.
 *
 * Auth Guard concerning user rights
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import _ = require('underscore');

import { UserService } from './user.service';

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // console.log ( route, state.url);
        let data = route.data;
        if (data && data['roles'] ) {

            let roles: string[] = _.map(data['roles'], (role: string) => {
                return role.toUpperCase();
            });

            return this.userService.userRolesCheckFull(roles).map( hasRole => {
                    if (!hasRole) {
                        this.router.navigate(['home']);
                    } return hasRole;
                }
            );
        }
        return Observable.of(true);
    }
}
