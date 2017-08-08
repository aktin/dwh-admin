/**
 * Created by Xu on 03.05.2017.
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Headers, Response, Request }          from '@angular/http';
import { Observable } from 'rxjs/Observable';

import _ = require('underscore');

import { StorageService } from './storage.service';
import { CleanUpAuthService } from './clean-up-auth.service';

@Injectable()
export class HttpInterceptorService {
    private _dataInterval: 3000;

    constructor(
        private _http: Http,
        private _store: StorageService,
        private _cleanUp: CleanUpAuthService
    ) {
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string | any, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.delete(url, this.getRequestOptionArgs(options));
    }

    // throttled Got function.
    debouncedGet<T> (
        vlName: string,
        value: T, nullVal: T,
        dbTime: number,
        url: string,
        parseResponse: (res: Response) => T,
        parseError: (err: Response) => Response,
    ): Observable<T> {
        // console.log('here: ', vlName, value, nullVal, dbTime, url);
        // check whether logged in. if not then nada.
        if (this._store.getValue('user.token') === null) {
            return Observable.of(nullVal);
        }
        if (! dbTime ) {
            dbTime = this._dataInterval;
        }

        if (Date.now() - this._store.getTime(vlName) <= dbTime) {
            return Observable.of(value);
        }

        this._store.setTime(vlName);
        return this.get(url).map(res => {
            this._store.setTime(vlName);
            value = parseResponse(res);
            return value;
        }).catch(err => {
            err = parseError(err);
            return this.handleError(err);
        });
    }

    handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status === 401) {
                this._cleanUp.cleanUpStorage('Sitzung abgelaufen. Bitte erneut anmelden');
                this._cleanUp.redirect2Home();
            }
            const body = error.text() || '';
            const err = /*body.error ||*/ JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    generateHeaderOptions (key?: string, value?: string, options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (key) {
            options.headers.append(key, value);
        }
        return options;
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        options = this.generateHeaderOptions(null, null, options);
        if (this._store.getValue('user.token') /* && config.url === getUrl("/auth/login") */ ) {
            options.headers.set('Authorization', 'Bearer ' + this._store.getValue('user.token'));
        }
        return options;
    }
}
