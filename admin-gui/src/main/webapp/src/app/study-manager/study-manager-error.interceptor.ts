import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {StudyManagerError, StudyManagerErrorType} from './error-types';
import {NotificationService} from '../helpers';

@Injectable()
export class StudyManagerErrorInterceptor implements HttpInterceptor {
    constructor(private notificationService: NotificationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((response: HttpErrorResponse) => {
            const err = response.error as StudyManagerError;
            switch (err.type) {
                case StudyManagerErrorType.PATIENT_ALREADY_EXISTS:
                    err.readable = "Patient*in existiert bereits";
                    break;
                case StudyManagerErrorType.SIC_ALREADY_EXISTS:
                    err.readable = "SIC existiert bereits";
                    break;
                case StudyManagerErrorType.PATIENT_NOT_FOUND:
                    err.readable = "Patient*in nicht gefunden";
                    break;
                case StudyManagerErrorType.STUDY_NOT_FOUND:
                    err.readable = "Studie nicht gefunden";
                    break;
                default:
                    err.readable = "";
            }
            return throwError(() => response);
        }));
    }

}
