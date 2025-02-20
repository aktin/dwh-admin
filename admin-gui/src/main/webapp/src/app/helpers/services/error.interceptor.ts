import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CleanUpAuthService} from "./clean-up-auth.service";
import {map} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _cleanUp: CleanUpAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const response$ = next.handle(request);
    response$.pipe(map(response => {
      // In a real world app, you might use a remote logging infrastructure
      if (response.type == HttpEventType.Response && !response.ok) {
        let errMsg: string;
        if (response.status === 401) {
          sessionStorage.removeItem('permissions');
          this._cleanUp.cleanUpStorage('Sitzung abgelaufen. Bitte erneut anmelden');
          this._cleanUp.redirect2Home();
        }
        let body;
        try {
          body = response.body.json()
        } catch {
          body = response.body.text() || '';
        }
        const err = JSON.stringify(body);
        errMsg = `${response.status} - ${response.statusText || ''} ${err}`;
        return throwError(errMsg);
      }
      // else {
      //   errMsg = response. ? error.message : error.toString();
      // }
      return response;
    }));

    return response$
  }
}
