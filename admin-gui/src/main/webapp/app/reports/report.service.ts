
/**
 * Created by Xu on 09.05.2017.
 *
 * Reports Service
 */
import { Injectable } from '@angular/core';
import { Response, ResponseContentType, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService, DownloadService } from '../helpers/index';
import { AuthService } from './../users/auth.service';
import { Report, ReportTemplate } from './report';
import { Permission } from '../users/index';

@Injectable()
export class ReportService {

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _download: DownloadService,
        private _auth: AuthService
    ) {}

    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_REPORTS':
                perm = Permission.READ_REPORTS;
                break;
            case 'WRITE_REPORTS':
                perm = Permission.WRITE_REPORTS;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

    getReports(etag: string): Observable<Object> {
        let options = { headers: new Headers({'If-None-Match': etag}), 'observe': 'response' };
        return this._http.get(this._urls.parse('reportsList'), options)
            .catch(err => { return this._http.handleError(err) })
            .map(resp => {
                let res = {};
                res['etag'] = resp.headers.get('ETag');
                res['reports'] = _.map(JSON.parse(resp.text()), rep => Report.parseObj(rep));
                return res;
            });
    }

    getReport(id: number, etag: string): Observable<Object> {
        let options = { headers: new Headers({'If-None-Match': etag}), 'observe': 'response' };
        return this._http.get(this._urls.parse('report', {reportId: id}), options)
            .catch(err => { return this._http.handleError(err) })
            .map(resp => {
                let res = {};
                res['etag'] = resp.headers.get('ETag');
                res['report'] = Report.parseObj(JSON.parse(resp.text()));
                return res;
            });
    }

    newReportMonthly (): void {
        this._http.post(this._urls.parse('newMonthlyReport'), {}).catch(err => {return this._http.handleError(err); })
            .subscribe();
    }

    newReport (template: string, fromDate: Date, toDate: Date): void {
        // console.log({'from': fromDate.toISOString(), 'to': toDate.toISOString()});
        this._http.post(
            this._urls.parse('newReport', {templateId: template}),
            {'start': fromDate.toISOString(), 'end': toDate.toISOString()},
            this._http.generateHeaderOptions('Content-Type', 'application/json')
        ).catch(err => {return this._http.handleError(err); })
            .subscribe();
    }

    getReportTemplates(): Observable<ReportTemplate[]> {
        return this._http.get(this._urls.parse('reportTemplates'))
            .catch(err => { return this._http.handleError(err) })
            .map(resp => {
               return <ReportTemplate[]> JSON.parse(resp.text());
            });
    }

    downloadReportFile (report: Report) {
        this._download.get(report.name, 'application/pdf', report.url);
    }
}
