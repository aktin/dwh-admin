import {catchError, map} from 'rxjs/operators';
import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, takeUntil, tap} from 'rxjs';

import {Permission} from './../users/index';
import {AuthService} from './../users/auth.service';
import {HttpService, UrlService} from '../helpers/index';
import {ImportScript} from './enums/ScriptKey';
import {LogType} from './enums/LogType';
import {UploadedFile} from './ListEntry';
import {PropertiesKey} from './enums/PropertiesKey';
import {ImportOperation} from './enums/ImportOperation';
import {ImportState} from './enums/ImportState';

/**
 * Service component of file importer
 * Manages all requests to file importer endpoint (java backend) and
 * checks user permission for importer component
 */
@Injectable()
export class ImporterService implements OnDestroy {
    private _cancelUpload$: Subject<void> = new Subject<void>();

    constructor(
        private _auth: AuthService,
        private _http: HttpService,
        private _urls: UrlService
    ) {
    }

    ngOnDestroy(): void {
        this._cancelUpload$.complete();
    }

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
    getUploadedFiles(): Observable<UploadedFile[]> {
        return this._http.get<UploadedFile[]>(this._urls.parse('uploadFiles'))
            .pipe(map(files => files.map((json: any) =>
                new UploadedFile(
                    json[PropertiesKey.script],
                    json[PropertiesKey.filename],
                    json[PropertiesKey.size],
                    json[PropertiesKey.id],
                    json[PropertiesKey.operation],
                    json[PropertiesKey.state]))));
    }

    /**
     * GET request for metadata of single uploaded file
     * @param uuid id of requested file
     * @returns requested file metadata
     */
    public getUploadedFile(uuid: string): Observable<any> {
        return this._http.get(this._urls.parse('uploadFile', {uuid: uuid}));
    }

    /**
     * POST request to upload file to server
     * @param file binary of file to upload
     * @param name_file original name of file
     * @param id_script id of corresponding processing script
     * @returns 201
     */
    public uploadFile(file: File, name_file: string, id_script: string): Observable<string> {
        // response type text because the response is the uuid of the uploaded file
        return this._http.post(this._urls.parse('uploadFiles'), file, {
            params: {
                scriptId: id_script,
                filename: name_file
            }, responseType: 'text'
        }).pipe(takeUntil(this._cancelUpload$));
    }

    /**
     * abort the file upload
     */
    public cancelUpload(): void {
        this._cancelUpload$.next();
    }

    /**
     * DELETE request for uploaded file, deletes file from harddrive
     * @param uuid id of file to delete
     * @returns 200
     */
    deleteFile(uuid: string): Observable<any> {
        return this._http.delete(this._urls.parse('uploadFile', {uuid: uuid})).pipe(
            catchError(err => {
                return this._http.handleError(err);
            }));
    }

    /**
     * GET request for processing script logs (are created during verification or import)
     * @param uuid id of file to request logs of
     * @returns list with script logs (stdError and stdOutput)
     */
    public getScriptLogs(uuid: string): Observable<ScriptLog[]> {
        return this._http.get<ScriptLog[]>(this._urls.parse('scriptLogs', {uuid: uuid}));
    }

    /**
     * GET request for metadata of uploaded scripts
     * @returns list with uploaded scripts metadata
     */
    getImportScripts(): Observable<ImportScript[]> {
        return this._http.get<ImportScript[]>(this._urls.parse('importScripts'));
    }

    /**
     * POST request to start file import
     * @param uuid id of file to import
     * @returns 202
     */
    importFile(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('importFile', {uuid: uuid}), '').pipe(
            catchError(err => {
                return this._http.handleError(err);
            }));
    }

    /**
     * POST request to stop current file processing (verify or import)
     * @param uuid id of file to stop processing of
     * @returns 202
     */
    cancelProcess(uuid: string): Observable<any> {
        return this._http.post(this._urls.parse('cancelProcess', {uuid: uuid}), '').pipe(
            catchError(err => {
                return this._http.handleError(err);
            }));
    }
}

export interface ScriptLog {
    id: string;
    type: LogType;
    text: string;
}
