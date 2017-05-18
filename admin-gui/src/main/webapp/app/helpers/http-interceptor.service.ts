/**
 * Created by Xu on 03.05.2017.
 */

import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Headers, Response, Request }          from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { StorageService } from './helpers.service';

@Injectable()
export class HttpInterceptorService {
    constructor(private http: Http, private store: StorageService) {
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string | any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.delete(url, options);
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (this.store.getValue('user.token') /* && config.url === getUrl("/auth/login") */ ) {
            options.headers.set('Authorization', 'Bearer ' + this.store.getValue('user.token'));
            // options.headers.append('Content-Type', 'application/json');
            // options.headers['Authorization'] = 'Bearer ' + this.store.getValue('user.token');
        }

        // console.log('options ', options, 'Bearer ' + this.store.getValue('user.token'));
        // options.headers.append('Content-Type', 'application/json');
        return options;
    }
}
