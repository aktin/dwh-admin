/**
 * Created by Xu on 08-Jun-17.
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { LocalRequest } from './request';

@Injectable()
export class RequestService {
    private _dataInterval = 3000;

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    private _updateRequest (): void {
        this._http.debouncedGet<string> (
            'requests',
            this._store.getValue('requests.data'), null,
            this._dataInterval,
            this._urls.parse('requestList'),
            (res: Response) => {
                return res.text();
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            (req: string) => {
                if (req) {
                    this._store.setValue('requests.data', req);
                }
            },
            error => console.log(error)
        );
    }

    getRequests (): LocalRequest[] {
        this._updateRequest();
        return _.map(JSON.parse(this._store.getValue('requests.data')),
                                    req => LocalRequest.parseRequest(req));

    }
}
