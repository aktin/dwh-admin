import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {StudyManagerErrorType} from '../models/error-types';

@Injectable()
export class StudyManagerErrorInterceptor implements HttpInterceptor {
    /**
     * Intercepts all http errors and translates them into human readable messages
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((response: HttpErrorResponse) => {
            let err = response.error;
            switch (err.detail) {
                case StudyManagerErrorType.PATIENT_ALREADY_EXISTS:
                    err = "Patient*in existiert bereits";
                    break;
                case StudyManagerErrorType.SIC_ALREADY_EXISTS:
                    err = "SIC existiert bereits";
                    break;
                case StudyManagerErrorType.PATIENT_NOT_FOUND:
                    err = "Patient*in nicht gefunden";
                    break;
                case StudyManagerErrorType.STUDY_NOT_FOUND:
                    err = "Studie nicht gefunden";
                    break;
                default:
                    err = "Unbekannter Fehler";
            }

            return throwError(() => err);
        }));
    }

}
