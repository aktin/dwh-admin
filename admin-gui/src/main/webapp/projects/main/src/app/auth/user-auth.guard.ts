import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate {
  constructor(private _authService: AuthenticationService) {}

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
    if (data && data["permissions"]) {
      let hasPermission = this._authService.userLocalCheckPermissions(data["permissions"]);
      if (!hasPermission) {
        this._authService.redirect2Home(state.url);
        return false;
      }
    }
    return true;
  }
}
