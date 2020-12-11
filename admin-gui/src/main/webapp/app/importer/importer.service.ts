import { Injectable }   from '@angular/core';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';
import { Permission } from '../users';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import form = require('semantic-ui-form');
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { HttpModule } from '@angular/http';

import { ProgressHttp } from 'angular-progress-http';

// TODO: comments
@Injectable()
export class ImporterService {

    constructor(
        private _auth: AuthService,
        private _url: UrlService,
        private _http: HttpInterceptorService,
        private http: ProgressHttp,
    ) {}

    /**
     * Checks if the user has the given permission.
     * @param permission The permission that will be checked.
     * @returns true if user has the permission, false otherwise
     */
    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_P21':
                // perm = Permission.READ_P21;
                break;
            case 'WRITE_P21':
                // perm = Permission.WRITE_P21;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

    // TODO may produce problems in future because of ProgressHttp
    uploadFile(file: File, file_name: string, script: string, id_progress_bar: string): Observable<any> {
        return this.http.withUploadProgressListener(
            upload => { $('#' + id_progress_bar).progress('set progress', upload.percentage); })
            .post(this._url.parse('uploadFile'), file, { params: { script: script, filename: file_name } })
            .catch(err => { 
                $('#' + id_progress_bar).progress('reset');
                return this._http.handleError(err); });
    }

    verifyFile(uuid: string): Observable<any> {
        return this._http.post(this._url.parse('verifyFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    importFile(uuid: string): Observable<any> {
        return this._http.post(this._url.parse('importFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    deleteFile(uuid: string): Observable<any> {
        return this._http.delete(this._url.parse('deleteFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    getImportScripts(): Observable<any> {
        return this._http.get(this._url.parse('getScripts'))
            .catch(err => { return this._http.handleError(err); });
    }

    getUploadedFiles(): Observable<any> {
        return this._http.get(this._url.parse('getFiles'))
            .catch(err => { return this._http.handleError(err); });
    }
}
