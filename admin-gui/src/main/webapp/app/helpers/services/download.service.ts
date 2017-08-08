/**
 * Created by Xu on 08.08.2017.
 */
import { Injectable } from '@angular/core';
import { ResponseContentType } from '@angular/http';
import { HttpInterceptorService } from './http-interceptor.service';

import FileSaver = require('file-saver');

@Injectable()
export class UrlService {
    constructor(
        private _http: HttpInterceptorService,
    ) {}
    get (filename: string, type: string, url: string): void {
        let headers = this._http.generateHeaderOptions('Accept', type);
        headers.responseType = ResponseContentType.Blob;
        this._http.get(url, headers).map(res => res.blob()).subscribe(blob => FileSaver(blob, filename),
            error => console.log('Error downloading the file.'));
    }
}
