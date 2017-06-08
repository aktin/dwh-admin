/**
 * Created by Xu on 08-Jun-17.
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';

@Injectable()
export class RequestService {
    private _dataInterval = 3000;

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    private _updateRequest (): void {
        this._http.debouncedGet<void> (
            'requests',
            null, null,
            this._dataInterval,
            this._urls.parse('requestList'),
            (res: Response) => {
                console.log(res.json());
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            rep => {
                if (rep) {
                    this._store.setValue('requests.data', JSON.stringify(rep));
                }
            },
            error => console.log(error)
        );
    }

    getRequests (): void {

        this._updateRequest();
    }
}
