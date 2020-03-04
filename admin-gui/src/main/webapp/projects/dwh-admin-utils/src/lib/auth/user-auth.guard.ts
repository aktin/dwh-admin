import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { redirect2Home, userLocalCheckPermissions } from "./services";

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
      let hasPermission = userLocalCheckPermissions(data["permissions"]);
      if (!hasPermission) {
        console.log("no auth");
        redirect2Home(state.url);
        return false;
      }
    }
    return true;
  }
}
