/**
 * Created by Xu on 03.05.2017.
 */
import { Injectable, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Response } from '@angular/http';
import { DomSanitizer} from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import _ = require('underscore');

import { HttpInterceptorService } from './http-interceptor.service';

@Injectable()
export class StorageService {
    setValue (key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    getValue (key: string): string {
        return localStorage.getItem(key);
    }

    deleteValue (key: string): void {
        localStorage.removeItem(key);
    }

    getTime (key: string): number {
        return +(this.getValue(key + '.time') || 0);
    }
    setTime (key: string): void {
        return this.setValue(key + '.time', String(Date.now()));
    }

    /**
     * remove all data from storage. really clean then
     */
    clear (): void {
        localStorage.clear();
    }
}

@Injectable()
export class UrlService {
    // /*
    private serverUrl = 'http://134.106.36.86:8087';
    /*/
    private serverUrl = 'http://localhost:8080';
    // */
    private baseUrl =  '/aktin/admin/rest';
    private endUrls = {
        login : '/auth/login',
        logout : '/auth/logout',
        adminCheck : '/auth/has/admin',
        userCheck : '/auth/check/',
        userUpdate : '/auth/update',

        getUsers : '/users', // get
        editUser : '/users/@user@', // put / delete
        getRoles : '/users/roles', // get
        getUserRoles : '/users/@user@/roles', // get
        editUserRole : '/users/@user@/roles/@role@', // put / delete

        prefs : '/prefs',

        reportsList : '/report/archive',
        newMonthlyReport : '/report/monthly/email',
    };

    setBaseUrl (baseUrl: string): void {
        this.baseUrl = baseUrl;
    }

    getBaseUrl (): string {
        return this.baseUrl;
    }

    /**
     *
     * @param key
     * @param args has the form {user: some user, role: some role}
     * @returns {string}
     */
    parse (key: string, args ?: any): string {
        let endUrl = this.endUrls[key] || key;
        let keys = endUrl.match(/@\w*@/g);
        if (keys && keys.length >= 0) {
            endUrl = _.reduce(
                keys,
                (memo: string, item: string) => {
                    return memo.replace(item, args[/\w+/.exec(item)[0]]);
                },
                endUrl
            );
        }

        return this.serverUrl + this.baseUrl + endUrl;
        // return this.baseUrl + (this.endUrls[key] || key);
    }
}

@Injectable()
export class HTTPHandlerService {

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
        // check whether logged in. if not then nada.
        if (store.getValue('user.token') === null) {
            return Observable.of(nullVal);
        }

        if (Date.now() - store.getTime(vlName) <= dbTime) {
            return Observable.of(value);
        }

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

export class DateParser {
    public static getMonth(month: number, short = false): string {
        let MonthDe: string[] = [
                'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
            ];
        let Month: string[] = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ];
        let MonthDeLong: string[] = [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Ockober', 'November', 'Dezember'
            ];
        let  MonthLong: string[] = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ];

        let monthArray = Month;
        switch (LOCALE_ID.toString()) {
            case 'de-DE' :
                if (short) {
                    monthArray = MonthDe;
                } else {
                    monthArray = MonthDeLong;
                }
                break;
            default :
                if (short) {
                    monthArray = Month;
                } else {
                    monthArray = MonthLong;
                }
                break;
        }
        return monthArray[month];
    }
}

