/**
 * Created by Xu on 08.08.2017.
 */
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';

import FileSaver from 'file-saver';

@Injectable()
export class DownloadService {
    constructor(private _http: HttpService) {
    }

    get(filename: string, type: string, url: string): void {
        this._http.get<Blob>(url, {headers: this._http.generateHeaderOptions('Accept', type)}).subscribe({
            next: blob => FileSaver(blob, filename),
            error: error => {
                console.log('Error downloading the file.');
                return error;
            }
        });
    }
}
