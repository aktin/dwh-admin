import { Injectable } from "@angular/core";
import { Permission } from "./permission";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "@aktin/utils";
import { map } from "rxjs/operators";
import { User } from "@app/auth/models/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private _http: HttpClient, private _urls: UrlService) {}

  redirect2Home(url?: string): void {
    // do some thing
    console.log("home");
    return;
  }

  userLogin(username: string, password: string): Observable<User> {
    return this._http
      .post(this._urls.parse("login"), { username: username, password: password })
      .pipe(
        map(res => {
          let user: User;
          if (res) {
            user = new User(username, res.toString());
            console.log("login some in ", res);
            // this._store.setValue('user.auth.time', String(Date.now()));
            // this._store.setValue('user.name', user.username);
            // this._store.setValue('user.token', user.token);
            // this.adminCheck().subscribe();
            this.setPermissions().subscribe();
            return user;
          }
        }),
      );
  }

  /**
   * Get permissions from server depending on user role and writes them to the sessionStorage.
   */
  setPermissions() {
    return this._http.get(this._urls.parse("permissions")).pipe(
      map(res => {
        console.log(res);
        //sessionStorage.setItem("permissions", res);
      }),
    );
  }

  //
  /**
   * IMPROVE: better way than using sessionStorage?
   * add delayed check with server?
   *
   * Check permissions by comparing the given values with the values in the sessionStorage.
   */
  userLocalCheckPermissions(checkPermissions: Permission[]): boolean {
    if (!checkPermissions || checkPermissions.length === 0) {
      return true;
    }
    if (sessionStorage.getItem("permissions") === null) {
      return false;
    }
    let perm: Permission[] = [];
    JSON.parse(sessionStorage.getItem("permissions")).forEach(function(p: String) {
      perm.push(Permission[p as keyof typeof Permission]);
    });
    for (let i = 0; i < checkPermissions.length; i++) {
      if (perm.indexOf(checkPermissions[i]) !== -1) {
        return true;
      }
    }
    return false;
  }
}
