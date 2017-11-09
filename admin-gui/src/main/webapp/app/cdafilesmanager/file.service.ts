/**
 * Created by Xu on 06.11.2017.
 *
 * Files Service
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService, DownloadService } from '../helpers/index';
import { CDAFile } from './file';

@Injectable()
export class FileService {

    private _dataInterval = 3000;

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService,
        private _download: DownloadService
    ) {}

    private _updateCDAFiles (): void {
        this._http.debouncedGet<void> (
            'cdafiles',
            null, null,
            this._dataInterval,
            this._urls.parse('cdaFileList'),
            (res: Response) => {
                // console.log(res.json());
                return _.map(res.json(), raw => {
                    return CDAFile.parseObj(raw);
                });
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            file => {
                if (file) {
                    this._store.setValue('cdafiles.data', JSON.stringify(file));
                }
            },
            error => console.log(error)
        );
    }

    getCDAFiles (): CDAFile[] {
        this._updateCDAFiles();
        return _.map(JSON.parse(this._store.getValue('cdafiles.data')), file => { return CDAFile.parseObj(file); } );
    }

    getCDAFile (id = -1): CDAFile {
        this._updateCDAFiles();
        let files: CDAFile[] = JSON.parse(this._store.getValue('cdafiles.data'));

        if (!files) {
            return null;
        }
        if (id < 0) {
            id = files.length;
        }
        return CDAFile.parseObj(_.find(files, (file) => file['id'] === id));
    }
}
