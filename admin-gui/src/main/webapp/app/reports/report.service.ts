/**
 * Created by Xu on 09.05.2017.
 *
 * Reports Service
 */
import { Injectable } from '@angular/core';
import { Response }          from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { HTTPHandlerService, StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { Report, RawReport } from './report';

@Injectable()
export class ReportService {

    private getDataInterval: number = 3000;

    constructor(
        private httpHandler: HTTPHandlerService,
        private http: HttpInterceptorService,
        private urls: UrlService,
        private store: StorageService
    ) {}

    private updateReport (): void {
        this.httpHandler.debouncedGet<void> (
            'reports',
            null,
            null,
            this.getDataInterval,
            this.urls.parse('reportsList'),
            (res: Response) => {
                // console.log(res);
                return _.map(res.json(), rawRep => {
                    return Report.parseReport(<RawReport>rawRep, this.urls.parse('reportsList'));
                });
            }, (err: Response) => {
                return err;
            }, this.http, this.store
        ).subscribe(
            rep => {
                if (rep) {
                    this.store.setValue('reports.data', JSON.stringify(rep));
                }
            },
            error => console.log(error)
        );
    }

    getReports (): Report[] {

        this.updateReport();
        return _.map(JSON.parse(this.store.getValue('reports.data')), rep => { return Report.parseObj(rep); } );
    }

    getReport (id: number = -1): Report {

        this.updateReport();
        let reports: Report[] = JSON.parse(this.store.getValue('reports.data'));

        if (!reports) {
            return null;
        }
        if (id < 0) {
            id = reports.length - 1;
        }
        return Report.parseObj(reports[id]);
    }

    newReport (): void {
        this.http.post(this.urls.parse('newMonthlyReport'), {}).catch(err => {return this.httpHandler.handleError(err); })
            .subscribe();
    }
}
