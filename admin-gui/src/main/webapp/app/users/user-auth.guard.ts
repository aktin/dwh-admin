/**
 * Created by Xu on 28.04.2017.
 *
 * Auth Guard concerning user rights
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import _ = require('underscore');

import { AuthService } from './auth.service';

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private _router: Router, private _authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // console.log ( route, state.url);
        let data = route.data;
        if (data && data['roles'] ) {
            let roles: string[] = _.map(data['roles'], (role: string) => {
                return role.toUpperCase();
            });

            return this._authService.userRolesCheckFull(roles).map( hasRole => {
                    if (!hasRole) {
                        this._authService.redirect2Home(state.url);
                        // this._router.navigate(['home']);
                    } return hasRole;
                }
            );
        }
        return Observable.of(true);
    }
}
