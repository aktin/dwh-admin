import {catchError} from 'rxjs/operators';
/**
 * Created by Xu on 09.05.2017.
 *
 * Reports Service
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';


import {DownloadService, HttpService, StorageService, UrlService} from '../helpers/index';
import {AuthService} from './../users/auth.service';
import {Report, ReportTemplate} from './report';
import {Permission} from '../users/index';

@Injectable()
export class ReportService {

    private _dataInterval = 3000;

    constructor(
        private _http: HttpService,
        private _urls: UrlService,
        private _store: StorageService,
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

    private _updateReport (): void {
        this._http.debouncedGet<any> (
            'reports',
            null, null,
            this._dataInterval,
            this._urls.parse('reportsList'),
            res => {
                // console.log(res.json());
                return res.map((rawRep: any) => {
                    return Report.parseObj(rawRep, this._urls.parse('reportsList'));
                });
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            rep => {
                if (rep) {
                    this._store.setValue('reports.data', JSON.stringify(rep));
                }
            },
            error => console.log(error)
        );
    }

    private _updateReportTemplates (): void {
        this._http.debouncedGet<string> (
            'reports.templates',
            this._store.getValue('reports.templates'), null,
            this._dataInterval,
            this._urls.parse('reportTemplates'),
            res => res
        ).subscribe(
            (rep: string) => {
                if (rep) {
                    this._store.setValue('reports.templates', rep);
                }
            },
            error => console.log(error)
        );
    }

    getReports (): Report[] {
        this._updateReport();
        return JSON.parse(this._store.getValue('reports.data')).map((rep: any) => { return Report.parseObj(rep); } );
    }

    getReport (id: number = -1): Report {

        this._updateReport();
        let reports: Report[] = JSON.parse(this._store.getValue('reports.data'));

        if (!reports) {
            return null;
        }
        if (id < 0) {
            id = reports.length;
        }
        return Report.parseObj(reports.find(rep => rep['id'] === id));
    }

    newReportMonthly (): void {
        this._http.post(this._urls.parse('newMonthlyReport'), {}).pipe(catchError(err => {return this._http.handleError(err); }))
            .subscribe();
    }

    newReport (template: string, fromDate: Date, toDate: Date): void {
        // console.log({'from': fromDate.toISOString(), 'to': toDate.toISOString()});
        this._http.post(
            this._urls.parse('newReport', {templateId: template}),
            {'start': fromDate.toISOString(), 'end': toDate.toISOString()},
            {headers: this._http.generateHeaderOptions('Content-Type', 'application/json')}
        ).pipe(catchError(err => {return this._http.handleError(err); }))
            .subscribe();
    }

    getReportTemplates (): ReportTemplate[] {
        this._updateReportTemplates();
        return JSON.parse(this._store.getValue('reports.templates'));
    }

    getDefaultTemplate (): ReportTemplate {
        this._updateReportTemplates();
        return (JSON.parse(this._store.getValue('reports.templates')) || [])[0];
    }

    downloadReportFile (report: Report) {
        this._download.get(report.name, 'application/pdf', report.url);
    }

    deleteReportFile(id: number): Observable<any> {
        return this._http.delete(this._urls.parse('deleteReport', { id: id })).pipe(
            catchError(err => { return this._http.handleError(err); }));
    }
}
