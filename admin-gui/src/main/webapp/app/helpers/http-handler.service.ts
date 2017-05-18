/**
 * Created by Xu on 18.05.2017.
 */
import { Injectable, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Response }                 from '@angular/http';
import { DomSanitizer}              from '@angular/platform-browser';
import { Observable }               from 'rxjs/Observable';

import _ = require('underscore');

import { HttpInterceptorService }   from './http-interceptor.service';
import { StorageService }           from './helpers.service';

@Injectable()
export class HTTPHandlerService {
    constructor (
        private http: HttpInterceptorService,
        private store: StorageService
    ) {}

    debouncedGet<T> (
        vlName: string,
        value: T, nullVal: T,
        dbTime: number,
        url: string,
        parseResponse: (res: Response) => T,
        parseError: (err: Response) => Response,
        httpd: HttpInterceptorService,
        store: StorageService
    ): Observable<T> {
        // check whether logged in. if not then nada.
        if (store.getValue('user.token') === null) {
            return Observable.of(nullVal);
        }

        if (Date.now() - store.getTime(vlName) <= dbTime) {
            return Observable.of(value);
        }

        store.setTime(vlName);
        return this.http.get(url).map(res => {
            store.setTime(vlName);
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
            const body = error.text() || '';
            const err = /*body.error ||*/ JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
