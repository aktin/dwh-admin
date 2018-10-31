import { Injectable } from '@angular/core';
import { Response, ResponseContentType, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Permissions } from './../users/roles';
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
        let perm: Permissions;
        switch (permission) {
            case 'READ_STUDY_MANAGER':
                perm = Permissions.READ_STUDY_MANAGER;
                break;
            case 'WRITE_STUDY_MANAGER':
                perm = Permissions.WRITE_STUDY_MANAGER;
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

    getStudies(): Observable<Object> {
        return this._http.get(this._urls.parse('studies'))
            .map(res => { return JSON.parse(res.text()); })
            .catch(err => { return this._http.handleError(err); });
    }

    getEntries(studyId: String) {
        return this._http.get(this._urls.parse('entries', { studyId: studyId }))
            .map(resp => {
                let entries = JSON.parse(resp.text());
                entries.forEach(function(e: any) {
                    e.selected = false;
                    switch (e.participation) {
                        case 'OptIn':
                            e.participationString = 'Einschluss';
                            break;
                        case 'OptOut':
                            e.participationString = 'Ausschluss';
                            break;
                    }
                })
                return entries;
            })
            .catch(err => { return this._http.handleError(err); });
    }

    createEntry(id: String, ref: String, root: String, ext: String, opt: String, sic: String, comment: String) {
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
