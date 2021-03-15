import { Injectable } from '@angular/core';

import { Permission } from './../users/index';
import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';
import { Observable } from 'rxjs/Observable';

// TODO: comments

@Injectable()
export class ImporterService {

    constructor(
        private _auth: AuthService,
        private _http: HttpInterceptorService,
        private _urls: UrlService
    ) { }

    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_P21':
                perm = Permission.READ_P21;
                break;
            case 'WRITE_P21':
                perm = Permission.WRITE_P21;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

    getUploadedFiles(): Observable<any> {
        return this._http.get(this._urls.parse('uploadFiles'))
            .catch(err => { return this._http.handleError(err); });
    }

    getUploadedFile(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    uploadFile(file: File, name_file: string, id_script: string): Observable<any> {
        return this._http.post(this._urls.parse('uploadFiles'), file, { params: { scriptId: id_script, filename: name_file } })
            .catch(err => { return this._http.handleError(err); });
    }

    deleteFile(uuid: string): Observable<any> {
        return this._http.delete(this._urls.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    getScriptLogs(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('scriptLogs', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    getImportScripts(): Observable<any> {
        return this._http.get(this._urls.parse('importScripts'))
            .catch(err => { return this._http.handleError(err); });
    }

    verifyFile(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('verifyFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    importFile(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('importFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    cancelProcess(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('cancelProcess', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    getStatus(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('getStatus', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }
}
