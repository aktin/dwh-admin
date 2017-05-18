/**
 * Created by Xu on 18.05.2017.
 * Property service
 */
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineLatest';

import _ = require('underscore');

import { HttpHandlerService, StorageService, UrlService, HttpInterceptorService } from '../helpers/index';

/**
 * Service Class for user management and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class PreferenceService {
    private dataInterval = 3000;

    constructor (
        private httpHandler: HttpHandlerService,
        private http: HttpInterceptorService,
        private urls: UrlService,
        private store: StorageService
    ) {}

    updateProperties (): void {
        this.httpHandler.debouncedGet<void> (
            'prefs',
            null, null,
            this.dataInterval,
            this.urls.parse('prefs'),
            (res: Response) => {
                console.log(res.json());
                return res.text();
            }, (err: Response) => {
                return err;
            }, this.http, this.store
        ).subscribe(
            rep => {
            },
            error => console.log(error)
        );
    }
}
