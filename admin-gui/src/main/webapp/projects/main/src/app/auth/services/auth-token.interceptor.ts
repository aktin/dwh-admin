import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "@app/auth/services/auth.service";
import { select, Store } from "@ngrx/store";
import { State } from "@aktin/utils";
import { getToken } from "../store/selectors/auth.selectors";
import { first, flatMap } from "rxjs/operators";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor{
    
    constructor(private _store: Store<State>) { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this._store.select(getToken).pipe(
            first(),
            flatMap (token => {
                const authReq = !!token ? request.clone({
                    setHeaders: { Authorization:`Bearer ${token}` },
                }) : request;
                return next.handle(authReq)
            })
        );
    }
}
