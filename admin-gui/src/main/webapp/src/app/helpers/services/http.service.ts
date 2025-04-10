import {Observable, of, throwError} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {CleanUpAuthService} from './clean-up-auth.service';
import {Injectable} from '@angular/core';
/**
 * Created by Xu on 03.05.2017.
 */

@Injectable()
export class HttpService extends HttpClient {
    private _dataInterval: number = 3000;

    constructor(
        _handler: HttpHandler,
        private _store: StorageService,
        private _cleanUp: CleanUpAuthService
    ) {
        super(_handler);
    }

    public debounce<T>(
        vlName: string,
        value: T,
        nullVal: T,
        dbTime: number): (source$: Observable<T>) => Observable<T> {
        const that = this;
        return function (source$: Observable<T>): Observable<T> {
            // check whether logged in. if not then nada.
            if (that._store.getValue('user.token') === null) {
                return of(nullVal);
            }

            if (!dbTime) {
                dbTime = that._dataInterval;
            }

            if (Date.now() - that._store.getTime(vlName) <= dbTime) {
                return of(value);
            }

            that._store.setTime(vlName);
            return source$;
        }
    }

    // throttled Got function.
    public debouncedGet<T, K = T>(
        vlName: string,
        value: T,
        nullVal: T,
        dbTime: number,
        url: string,
        parseResponse: (res: T) => T | K,
        parseError: (err: any) => any = err => err,
    ): Observable<T | K> {
        // console.log('here: ', vlName, value, nullVal, dbTime, url);
        // check whether logged in. if not then nada.
        if (this._store.getValue('user.token') === null) {
            return of(nullVal);
        }
        if (!dbTime) {
            dbTime = this._dataInterval;
        }

        if (Date.now() - this._store.getTime(vlName) <= dbTime) {
            return of(value);
        }

        this._store.setTime(vlName);
        // @ts-ignore
        return this.get<T>(url).pipe(map(res => {
                this._store.setTime(vlName);
                value = <T>parseResponse(res);
                return res;
            }),
            catchError(err => parseError(err)),);
    }

    handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status === 401) {
                sessionStorage.removeItem('permissions');
                this._cleanUp.cleanUpStorage('Sitzung abgelaufen. Bitte erneut anmelden');
                this._cleanUp.redirect2Home();
            }
            let body;
            try {
                body = error.json()
            } catch {
                body = error.text() || '';
            }
            const err = /*body.error ||*/ JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return throwError(errMsg);
    }

    generateHeaderOptions(key?: string, value?: string, options?: HttpHeaders): HttpHeaders {
        if (options == null) {
            options = new HttpHeaders();
        }
        // if (options.) {
        //     options.headers = new Headers();
        // }
        if (key) {
            options.set(key, value);
        }
        return options;
    }

    // private getRequestOptionArgs(options?: HttpHeaders): HttpHeaders {
    //     options = this.generateHeaderOptions(null, null, options);
    //     if (this._store.getValue('user.token') /* && config.url === getUrl("/auth/login") */ ) {
    //         options.set('Authorization', 'Bearer ' + this._store.getValue('user.token'));
    //     }
    //     // options.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    //     // options.headers.append('Pragma', 'no-cache');
    //     // options.headers.append('Expires', '0');
    //     return options;
    // }
}
