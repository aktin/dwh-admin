/**
 * Created by Xu on 31-May-17.
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { ImportStatus } from './import-status';

@Injectable()
export class StatusService {

    private _dataInterval = 3000;

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    private _updateStatus (): void {
        // this._http.get(this._url.parse('status')).map(res => console.log(ImportStatus.parseObj(res.json()));).subscribe();
        this._http.debouncedGet<string> (
            'status',
            this._store.getValue('status.import') || '', '',
            this._dataInterval,
            this._urls.parse('status'),
            (res: Response) => {
                return res.text();
            }, (err: Response) => {
                return err;
            },
        ).subscribe(
            (status: string) => {
                if (status) {
                    this._store.setValue('status.import', status);
                }
            },
            error => console.log(error)
        );
    }

    getImportStatus (): ImportStatus {
        this._updateStatus();
        return ImportStatus.parseStr(this._store.getValue('status.import'));
    }
}
