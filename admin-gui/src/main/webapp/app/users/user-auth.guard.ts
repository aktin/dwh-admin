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

    constructor(private _authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this.isAuthorized(route, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isAuthorized(childRoute, state);
    }

    isAuthorized(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let data = route.data;
        if (data && data['permissions']) {
            let hasPermission = this._authService.userLocalCheckPermissions(data['permissions']);
            if (!hasPermission) {
                this._authService.redirect2Home(state.url);
                return false;
           }
        }
        return true;
    }

}
