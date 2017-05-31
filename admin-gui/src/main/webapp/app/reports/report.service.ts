/**
 * Created by Xu on 09.05.2017.
 *
 * Reports Service
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { HttpHandlerService, StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { Report, RawReport } from './report';

@Injectable()
export class ReportService {

    private _dataInterval = 3000;

    constructor(
        private _httpHandler: HttpHandlerService,
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    private _updateReport (): void {
        this._httpHandler.debouncedGet<void> (
            'reports',
            null, null,
            this._dataInterval,
            this._urls.parse('reportsList'),
            (res: Response) => {
                // console.log(res);
                return _.map(res.json(), rawRep => {
                    return Report.parseReport(<RawReport>rawRep, this._urls.parse('reportsList'));
                });
            }, (err: Response) => {
                return err;
            }, this._http, this._store
        ).subscribe(
            rep => {
                if (rep) {
                    this._store.setValue('reports.data', JSON.stringify(rep));
                }
            },
            error => console.log(error)
        );
    }

    getReports (): Report[] {

        this._updateReport();
        return _.map(JSON.parse(this._store.getValue('reports.data')), rep => { return Report.parseObj(rep); } );
    }

    getReport (id: number = -1): Report {

        this._updateReport();
        let reports: Report[] = JSON.parse(this._store.getValue('reports.data'));

        if (!reports) {
            return null;
        }
        if (id < 0) {
            id = reports.length - 1;
        }
        return Report.parseObj(reports[id]);
    }

    // TODO add parameters for new reports
    newReport (): void {
        this._http.post(this._urls.parse('newMonthlyReport'), {}).catch(err => {return this._httpHandler.handleError(err); })
            .subscribe();
    }
}
