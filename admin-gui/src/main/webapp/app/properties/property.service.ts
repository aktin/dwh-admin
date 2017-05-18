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

import { HttpInterceptorService } from '../helpers/http-interceptor.service';
import { HTTPHandlerService, StorageService, UrlService } from '../helpers/helpers.service';

/**
 * Service Class for user management and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class PropertyService {
    constructor (
        private httpHandler: HTTPHandlerService,
        private http: HttpInterceptorService,
        private urls: UrlService,
        private store: StorageService
    ) {}
}
