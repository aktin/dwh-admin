import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "@app/auth/services/auth.service";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor{

  constructor(public _auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._auth.getToken()}`
      }
    });
    return next.handle(request);
  }
}
