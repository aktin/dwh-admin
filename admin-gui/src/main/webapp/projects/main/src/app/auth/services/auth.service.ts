import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import {catchError} from "rxjs/internal/operators/catchError";
import {of} from "rxjs/internal/observable/of";
import {tap} from "rxjs/internal/operators/tap";

import { User } from "../models/user";
import { Permission } from "../permission";
import { AuthUrlService } from "@app/auth/services/auth-url.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private _http: HttpClient, private _url: AuthUrlService) {}

  private token: string;

  public getToken () : string {
    return this.token;
  }

  redirect2Home(url?: string): void {
    // do some thing
    console.log("home");
    return;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  userLogin(username: string, password: string): Observable<User> {
    return this._url
      .post<String>("login", { username: username, password: password }, {responseType:  'text' as 'json'})
        .pipe(
            // tap ((res) => {console.log(res)}),
            map(res => {
              let user: User;
              if (res) {
                this.token = res.toString();
                user = new User(username, this.token);
                console.log("login some one in ", this.token, user);

                // this._store.setValue('user.auth.time', String(Date.now()));
                // this._store.setValue('user.name', user.username);
                // this._store.setValue('user.token', user.token);
                // this.adminCheck().subscribe();
                this.setPermissions().subscribe();
                return user;
              }
            }),
            catchError(this.handleError<User>('auth', null))
        )
      // .pipe(
      // );
  }

  /**
   * Get permissions from server depending on user role and writes them to the sessionStorage.
   */
  setPermissions() {
    return this._url.get("permissions").pipe(
      map(res => {
        console.log( res);
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
