import { Component, ViewChild, ElementRef } from '@angular/core';
import { ImporterService } from './importer.service';
import { ListEntry } from './ListEntry';
import { ImportState } from './ImportState';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/observable/of'
import 'rxjs/operator/delay';
import { delay } from 'rxjs/operator/delay';

require('semantic-ui');

@Component({
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
})

// TODO: comments
export class ImporterComponent {

    @ViewChild('FileInput') fileInput: any;

    process_selected = 1;
    list_processes: any[] = [];
    list_files_upload: ListEntry[] = [];
    response: string;

    reverse = true; // sort order ascending/descending
    sortAttribute = 'name';
    sorted = false;

    // TODO onleave this.ngUnsubscribe.complete();
    ImportState: typeof ImportState = ImportState;


    constructor(private _importerService: ImporterService) {
        this._importerService.getImportScripts()
            .subscribe(event => {
                let json = JSON.parse(event._body);
                for (let key of Object.keys(json)) {
                    let desc = json[key]["DESC"] + ' V' + json[key]["VERSION"];
                    this.list_processes.push({ id: key, description: desc });
                }
                this.process_selected = this.list_processes[0].id;
            }, (error: any) => {
                console.log(error);
            });
    }

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }

    /**
     * Handler for upload of file browser
     */
    onFileBrowse(files: any[]) {
        for (let file of files) {
            this.list_files_upload.push(new ListEntry(this._importerService, file));
        }
        $('#FileInput').val('');
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
     * Format file size in view
     * @param bytes: file size in bytes
     * @param decimals: decimals point (default: 2)
     */
    formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) { return '0 Bytes'; }
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    setSortAttribute(attr: string) {
        if (this.sortAttribute === attr) {
            this.reverse = !this.reverse;
        }
        this.sortAttribute = attr;
    }

    getSortAttribute() {
        if (this.reverse) {
            return '-' + this.sortAttribute;
        } else {
            return '+' + this.sortAttribute;
        }
    }
}

