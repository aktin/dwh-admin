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
        this._http.get(url, {headers: this._http.generateHeaderOptions('Accept', type), responseType: 'blob'}).subscribe({
            next: blob => FileSaver.saveAs(blob, filename),
            error: error => {
                console.log('Error downloading the file.');
                return error;
            }
        });
    }
}
