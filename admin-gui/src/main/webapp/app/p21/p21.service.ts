import { Injectable }   from '@angular/core';

import { AuthService } from './../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';
import { Permission } from '../users';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import form = require('semantic-ui-form');

import { HttpModule } from '@angular/http';

import { ProgressHttp } from 'angular-progress-http';

// TODO: comments
@Injectable()
export class P21Service {

    constructor(
        private _auth: AuthService,
        private _http: HttpInterceptorService,
        public _url: UrlService,
        private http: ProgressHttp,
    ) {}

    sayHello (): void {
        console.log('Hello, I am the P21Service');
    }

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
    uploadFile(file: File, id: string): Observable<any> {
        // ping

        return this.http.withUploadProgressListener(progress => {
            console.log(`Uploading ${progress.percentage}%`)
           // $('#' + id).progress({ percent: progress.percentage });
        })
            .post(this._url.parse('uploadFile'), file)
            .catch(err => { return this._http.handleError(err); });
    }

    verifyFile(uuid: string) {
        return this._http.post(this._url.parse('verifyFile', { uuid: uuid }), "")
            .catch(err => { return this._http.handleError(err); });
    }


    // Delete file
    deleteFile(uuid: string) {
        return this._http.delete(this._url.parse('deleteFile', { uuid: uuid }))
        .catch(err => { return this._http.handleError(err); });
    }

}


/*
                    onUploadProgress: function(progressEvent: any) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        console.log(percentCompleted)
                    }
 */
