import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import {AuthService} from "./services";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  constructor() {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthorized(next, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthorized(childRoute, state);
  }

  isAuthorized(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let data = route.data;
    console.log("checking permission", data);
    if (data && data["permissions"]) {
      let hasPermission = AuthService.userLocalCheckPermissions(data["permissions"]);
      if (!hasPermission) {
        console.log("no auth");
        AuthService.redirect2Home(state.url);
        return false;
      }
    }
    return true;
  }
}
