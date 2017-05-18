/**
 * Created by Xu on 18.05.2017.
 */
import { Injectable } from '@angular/core';
import { Response }   from '@angular/http';
import { Observable } from 'rxjs/Observable';
import _ = require('underscore');

import { HttpInterceptorService }   from './http-interceptor.service';
import { StorageService }           from './storage.service';

@Injectable()
export class HttpHandlerService {

    private dataInterval: 3000;

    constructor (
    ) {}

    debouncedGet<T> (
        vlName: string,
        value: T, nullVal: T,
        dbTime: number,
        url: string,
        parseResponse: (res: Response) => T,
        parseError: (err: Response) => Response,
        http: HttpInterceptorService,
        store: StorageService
    ): Observable<T> {
        console.log('here: ', vlName, value, nullVal, dbTime, url);
        // check whether logged in. if not then nada.
        if (store.getValue('user.token') === null) {
            return Observable.of(nullVal);
        }
        if (! dbTime ) {
            dbTime = this.dataInterval;
        }

        if (Date.now() - store.getTime(vlName) <= dbTime) {
            return Observable.of(value);
        }
        console.log('here', url, dbTime);

        store.setTime(vlName);
        return http.get(url).map(res => {
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
