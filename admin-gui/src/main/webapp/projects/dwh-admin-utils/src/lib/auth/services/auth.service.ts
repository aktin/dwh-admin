import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError} from "rxjs/operators";
import { User, Permission } from "../models/";
import { AuthUrlService } from "../services/auth-url.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private _http: HttpClient, private _url: AuthUrlService) {}
    
    private _token : string = "";
    
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            
            // console.error(error);
            //
            // console.log(`${operation} failed: ${error.message}`);
            
            return throwError(error || 'Authentication error');
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
                        this._token = res.toString();
                        user = new User(username, this._token);
                        console.log("login some one in ", this._token, user);
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
    getPermissions() {
        return this._url.get("permissions").pipe(
            map(res => {
                sessionStorage.setItem("permissions", JSON.stringify(res));
                return res;
            }),
        );
    }
    
    /**
     * Check User Authentication status
     */
    authCheck () {
        return this._url.get("authCheck");
    }
    
    
    
    userLogout () {
        sessionStorage.clear();
        return this._url.post("logout", this._token, this._url.generateHeaderOptions('Content-Type', 'text/plain'));
    }
}


/**
 * IMPROVE: better way than using sessionStorage?
 * add delayed check with server?
 *
 * Check permissions by comparing the given values with the values in the sessionStorage.
 */
export function userLocalCheckPermissions(checkPermissions: Permission[]): boolean {
    // console.log("in auth service permission checking", checkPermissions, sessionStorage.getItem("permissions"));
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

export function redirect2Home(url?: string): void {
    // do some thing
    console.log("home");
    return;
}