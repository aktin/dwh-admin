import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./services";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  constructor(private _authService: AuthService) {}

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
    console.log("checking permission");
    if (data && data["permissions"]) {
      let hasPermission = this._authService.userLocalCheckPermissions(data["permissions"]);
      if (!hasPermission) {
        console.log("no auth");
        this._authService.redirect2Home(state.url);
        return false;
      }
    }
    return true;
  }
}
