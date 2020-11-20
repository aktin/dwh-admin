/**
 * Drag n Drop File upload styling by https://github.com/progtarek/angular-drag-n-drop-directive
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { P21Service } from './p21.service';
import { ListEntry } from './p21.ListEntry';

require('semantic-ui');

@Component({
    templateUrl: './p21.component.html',
    styleUrls: ['./p21.component.css'],
})

export class P21Component {

    @ViewChild('fileDropArea') fileDropEl: ElementRef;
    process_selected = 1;
    list_processes: any[];
    list_files_upload: ListEntry[] = [];

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
     * Handler for upload of dropped files
     */
    onFileDropped($event: any[]) {
        this.readFiles($event);
    }

    /**
     * Handler for upload of file browser
     */
    onFileBrowse(files: any[]) {
        this.readFiles(files);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    readFiles(files: Array<any>) {
        for (let file of files) {

            this.list_files_upload.push(new ListEntry(file.name, file.size, 0, false));


        }
        this.fileDropEl.nativeElement.value = '';
    }

    /**
     * Delete entry from list_files_upload list
     * @param index (File index)
     */
    spliceFile(index: number) {

        // TODO: REMOVE
        $('#' + this.list_files_upload[index].id).progress('increment');



        if (this.list_files_upload[index].upload_progress < 100) {
            return;
        }
        this.list_files_upload.splice(index, 1);
    }

    /**
     * Abort current progress
     * delete entry from list_files_upload list
     * @param index (File index)
     */
    cancelUpload(index: number) {
        if (this.list_files_upload[index].upload_progress === 100) {
            return;
        }
        // TODO: ABORT
        this.spliceFile(index);
    }

    /**
     * Format size of files
     * @param bytes (file size in bytes)
     * @param decimals (decimals point)
     */
    formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) { return '0 Bytes'; }
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
