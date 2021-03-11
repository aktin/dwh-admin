import { Injectable } from '@angular/core';

import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';
import { Permission } from '../users';
import { Observable } from 'rxjs/Observable';

// TODO: comments

@Injectable()
export class ImporterService {

    constructor(
        private _auth: AuthService,
        private _url: UrlService,
        private _http: HttpInterceptorService,
    ) { }

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

    getUploadedFiles(): Observable<any> {
        return this._http.get(this._url.parse('uploadFiles'))
            .catch(err => { return this._http.handleError(err); });
    }

    getUploadedFile(uuid: string): Observable<any> {
        return this._http.get(this._url.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    uploadFile(file: File, name_file: string, id_script: string): Observable<any> {
        return this._http.post(this._url.parse('uploadFiles'), file, { params: { scriptId: id_script, filename: name_file } })
            .catch(err => { return this._http.handleError(err); });
    }

    deleteFile(uuid: string): Observable<any> {
        return this._http.delete(this._url.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    getScriptLogs(uuid: string): Observable<any> {
        return this._http.get(this._url.parse('scriptLogs', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    getImportScripts(): Observable<any> {
        return this._http.get(this._url.parse('importScripts'))
            .catch(err => { return this._http.handleError(err); });
    }

    verifyFile(uuid: string): Observable<any> {
        return this._http.post(this._url.parse('verifyFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    importFile(uuid: string): Observable<any> {
        return this._http.post(this._url.parse('importFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    cancelProgress(uuid: string): Observable<any> {
        return this._http.post(this._url.parse('cancelProgress', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    getStatus(uuid: string): Observable<any> {
        return this._http.get(this._url.parse('getStatus', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }
}
