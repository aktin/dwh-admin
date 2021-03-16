import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Permission } from './../users/index';
import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';

/**
 * Service component of file importer
 * Manages all requests to file importer endpoint (java backend) and
 * checks user permission for importer component
 */
@Injectable()
export class ImporterService {

    constructor(
        private _auth: AuthService,
        private _http: HttpInterceptorService,
        private _urls: UrlService
    ) { }

    /**
     * Checks, if current user has given permission
     * @param permission enum of Permissions.ts as string
     * @returns boolean if current user has requested permission
     */
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

    /**
     * GET request for metadata of uploaded files
     * @returns list with uploaded file metadata
     */
    getUploadedFiles(): Observable<any> {
        return this._http.get(this._urls.parse('uploadFiles'))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * GET request for metadata of single uploaded file
     * @param uuid id of requested file
     * @returns requested file metadata
     */
    getUploadedFile(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * POST request to upload file to server
     * @param file binary of file to upload
     * @param name_file original name of file
     * @param id_script id of corresponding processing script
     * @returns 201
     */
    uploadFile(file: File, name_file: string, id_script: string): Observable<any> {
        return this._http.post(this._urls.parse('uploadFiles'), file, { params: { scriptId: id_script, filename: name_file } })
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * DELETE request for uploaded file, deletes file from harddrive
     * @param uuid id of file to delete
     * @returns 200
     */
    deleteFile(uuid: string): Observable<any> {
        return this._http.delete(this._urls.parse('uploadFile', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * GET request for processing script logs (are created during verification or import)
     * @param uuid id of file to request logs of
     * @returns list with script logs (stdError and stdOutput)
     */
    getScriptLogs(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('scriptLogs', { uuid: uuid }))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * GET request for metadata of uploaded scripts
     * @returns list with uploaded scripts metadata
     */
    getImportScripts(): Observable<any> {
        return this._http.get(this._urls.parse('importScripts'))
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * POST request to start file verification
     * @param uuid id of file to verify
     * @returns 202
     */
    verifyFile(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('verifyFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * POST request to start file import
     * @param uuid id of file to import
     * @returns 202
     */
    importFile(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('importFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }

    /**
     * POST request to stop current file processing (verify or import)
     * @param uuid id of file to stop processing of
     * @returns 202
     */
    cancelProcess(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('cancelProcess', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }
}
