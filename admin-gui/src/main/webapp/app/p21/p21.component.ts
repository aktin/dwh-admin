import { Component, ViewChild, ElementRef } from '@angular/core';
import { P21Service } from './p21.service';
import { ListEntry } from './p21.ListEntry';
import { ImportState } from './ImportState';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/observable/of'
import 'rxjs/operator/delay';
import { delay } from 'rxjs/operator/delay';

require('semantic-ui');

@Component({
    templateUrl: './p21.component.html',
    styleUrls: ['./p21.component.css'],
})

// TODO: comments
export class P21Component {

    process_selected = 1;
    list_processes: any[];
    list_files_upload: ListEntry[] = [];
    response: string;

    // TODO onleave this.ngUnsubscribe.complete();
    ImportState: typeof ImportState = ImportState;

    constructor(private _p21service: P21Service) {

        // TODO: remove
        _p21service.sayHello();
        console.log('Hello, I am the P21Component');

        // TODO: Get List of all Python scripts
        this.list_processes = [
            {id: 1, description: 'Pfad1'},
            {id: 2, description: 'Pfad2'},
            {id: 3, description: 'Pfad3'},
            {id: 4, description: 'Pfad4'}
        ];
    }

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._p21service.checkPermission(permission);
    }

    /**
     * Handler for upload of file browser
     */
    onFileBrowse(files: any[]) {
        for (let file of files) {
            this.list_files_upload.push(new ListEntry(this._p21service, file));
        }
    }

    /**
     * Delete entry from list_files_upload list
     * @param index (File index)
     */
    deleteFile(index: number) {
        if(this.list_files_upload[index].uuid !== "") {
            this.list_files_upload[index].delete();
        }
        this.list_files_upload.splice(index, 1);
    }



    /**
     * Format size of files
     * @param bytes (file size in bytes)
     * @param decimals (decimals point)
     */
    formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) { return '0 Bytes'; }
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

