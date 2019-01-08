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

    /**
     * Checks if the user has the given permission.
     * @param permission The permission that will be checked.
     * @returns true if user has the permission, false otherwise
     */
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

    /**
     * Gets the preferences that are relevant for the consent manager.
     * @returns Observable of the preferences
     */
    getPreferences() {
        return this._http.get(this._urls.parse('studyPrefs'))
            .map(res => { return JSON.parse(res.text()); });
    }

    /**
     * Gets all available studies from the server.
     * @returns Observable of Study
     */
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

    /**
     * Gets all entries that exists for the given study
     * @param studyId The id of the study whose entries should be get.
     * @returns Observable of Entry
     */
    getEntries(studyId: string): Observable<Entry[]> {
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

    /**
     * Creates an entry specified by the given studyId, reference, root and extension.
     * @param id the id of the study for which the entry should be created
     * @param ref the patient reference
     * @param root the root id
     * @param the extension id
     * @param opt the participation (optIn or optOut)
     * @param sic the study identification code
     * @param comment the comment to the entry
     * @returns Observable of response
     */
    createEntry(id: string, ref: string, root: string, ext: string, opt: Participation, sic: string, comment: string) {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.post(this._urls.parse('entry', { studyId: id, reference: ref, root: root, extension: ext }),
                { 'opt': opt, 'sic': sic, 'comment': comment },
                this._http.generateHeaderOptions('Content-Type', 'application/json'))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * Deletes an entry specified by the given studyId, reference, root and extension.
     * @param id the id of the study
     * @param ref the patient reference
     * @param root the root id
     * @param ext the extension id
     * @returns Observable of response
     */
    deleteEntry(id: string, ref: string, root: string, ext: string) {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.delete(this._urls.parse('entry', { studyId: id, reference: ref, root: root, extension: ext }))
            .catch(err => { return this._http.handleError(err); });
    }

    redirect2Home() {
      return this._auth.redirect2Home();
    }
}
