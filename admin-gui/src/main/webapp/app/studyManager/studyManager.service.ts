import { Injectable } from '@angular/core';
import { Response, ResponseContentType, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Entry, Study, Participation } from './entry'
import { Permission } from './../users/index';
import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';

@Injectable()
export class StudyManagerService {

    constructor (
        private _auth: AuthService,
        private _http: HttpInterceptorService,
        private _urls: UrlService
    ) {}

    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_STUDYMANAGER':
                perm = Permission.READ_STUDYMANAGER;
                break;
            case 'WRITE_STUDYMANAGER':
                perm = Permission.WRITE_STUDYMANAGER;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

    getPreferences() {
        return this._http.get(this._urls.parse('studyPrefs'))
            .map(res => { return JSON.parse(res.text()); });
    }

    getStudies(): Observable<Study[]> {
        return this._http.get(this._urls.parse('studies'))
            .map(resp => {
                let result: Study[] = [];
                let studies = JSON.parse(resp.text());
                studies.forEach(function(s: any) {
                    result.push(new Study(s));
                });
                return result;
            })
            .catch(err => { return this._http.handleError(err); });
    }

    getEntries(studyId: String): Observable<Entry[]> {
        return this._http.get(this._urls.parse('entries', { studyId: studyId }))
            .map(resp => {
                let result: Entry[] = [];
                let entries = JSON.parse(resp.text());
                entries.forEach(function(e: any) {
                    result.push(new Entry(e));
                });
                result.sort(function(a: Entry, b: Entry) {
                    return b.timestamp - a.timestamp;
                });
                return result;
            })
            .catch(err => { return this._http.handleError(err); });
    }

    createEntry(id: String, ref: String, root: String, ext: String, opt: Participation, sic: String, comment: String) {
        return this._http.post(this._urls.parse('entry', { studyId: id, reference: ref, root: root, extension: ext }),
                { 'opt': opt, 'sic': sic, 'comment': comment },
                this._http.generateHeaderOptions('Content-Type', 'application/json'))
            .catch(err => { return this._http.handleError(err); });
    }

    deleteEntry(id: String, ref: String, root: String, ext: String) {
        return this._http.delete(this._urls.parse('entry', { studyId: id, reference: ref, root: root, extension: ext }))
            .catch(err => { return this._http.handleError(err); });
    }

    redirect2Home() {
      return this._auth.redirect2Home();
    }
}
