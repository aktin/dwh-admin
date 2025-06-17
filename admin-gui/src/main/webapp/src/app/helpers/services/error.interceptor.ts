import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpInterceptor,
    HttpRequest, HttpResponse,
    HttpStatusCode
} from '@angular/common/http';
import {Observable, of, switchMap, throwError} from 'rxjs';
import {CleanUpAuthService} from './clean-up-auth.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private _cleanUp: CleanUpAuthService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(response => {
            // Angular handles 304 (or even all non-2XX http status codes) as error
            // return response instead of throwing an error
            if(response.status === HttpStatusCode.NotModified) return of(response);
            if (response.status === HttpStatusCode.Unauthorized) {
                this.logout();
                throw "Sitzung abgelaufen";
            }
            const err = this.getError(response);
            console.error(`${response.status} - ${response.statusText || ''}`, err);
            throw err;
        }));
    }

    private logout(): void {
        sessionStorage.removeItem('permissions');
        this._cleanUp.cleanUpStorage('Sitzung abgelaufen. Bitte erneut anmelden.');
        this._cleanUp.redirect2Home();
    }

    private getError(response: any) {
        let error = '';
        if (typeof response.error === 'object') {
            error = response.error;
        } else if (typeof response.error === 'string') {
            error = response.error;
        }
        return error;
    }
}
