import { Component, ViewChild, forwardRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/observable/of'
import 'rxjs/operator/delay';

import { PopUpMessageComponent } from './../helpers/popup-message.component';

import { ImportState } from './enums/ImportState';
import { ImportOperation } from './enums/ImportOperation';
import { PropertiesKey } from './enums/PropertiesKey';
import { ScriptKey } from './enums/ScriptKey';

import { ImporterService } from './importer.service';
import { ListEntry } from './ListEntry';

require('semantic-ui');

@Component({
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
})

export class ImporterComponent {

    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpDeleteConfirm: PopUpMessageComponent = new PopUpMessageComponent();

    // connector to file browser
    @ViewChild('FileInput') fileInput: any;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    // lists for uploaded files and scripts
    private script_selected: string;
    private list_scripts: Map<string, string> = new Map<string, string>();
    private list_files_upload: ListEntry[] = [];

    // table sorting
    private sortAttribute = 'name_file';
    private reverse = true; // sort order ascending/descending
    private sorted = false;

    public importState: typeof ImportState = ImportState;
    public importOperation: typeof ImportOperation = ImportOperation;

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }

    /**
     * constructor for importer.component with two GET requests
     * first GET: request to '/aktin/admin/rest/script/get'
     * gets a json list of uploaded scripts and converts it to a list of string maps with <ID, name+version> (exp. <"script1.py", "importer V1.0">)
     * second GET: request to '/aktin/admin/rest/file/get'
     * gets a json list of uploaded files and converts it to a list of ListEntry(s)
     *
     * both lists are used to display the corresponding items in the view
     * @param _importerService: injected service to perform requests
     */
    constructor(private _importerService: ImporterService) {
        this._importerService.getImportScripts()
            .subscribe(event => {
                if (event._body) {
                    let list_json = JSON.parse(event._body);
                    list_json.forEach((json: any) => {
                        this.list_scripts.set(json[ScriptKey.id], [json[ScriptKey.viewname], " ", "V", json[ScriptKey.version]].join(""));
                    });
                    this.script_selected = Array.from(this.list_scripts)[0][0];
                }
            }, (error: any) => {
                console.log(error);
            });
        this._importerService.getUploadedFiles()
            .subscribe(event => {
                if (event._body) {
                    let list_json = JSON.parse(event._body);
                    list_json.forEach((json: any) => {
                        this.list_files_upload.push(
                            new ListEntry(
                                this._importerService,
                                null, // <- this is the binary file
                                json[PropertiesKey.script],
                                json[PropertiesKey.filename],
                                json[PropertiesKey.size],
                                json[PropertiesKey.id],
                                ImportOperation[json[PropertiesKey.operation] as keyof typeof ImportOperation],
                                ImportState[json[PropertiesKey.state] as keyof typeof ImportState]));
                    });
                }
            }, (error: any) => {
                console.log(error);
            });




        let i_script = "test.py";
        let i_name = "NAME";
        let i_size = 1024;
        let i_id = "";

        for (let o in ImportOperation) {
            for (let s in ImportState) {
                this.list_files_upload.push(
                    new ListEntry(
                        this._importerService,
                        null,
                        i_script,
                        i_name,
                        i_size,
                        i_id,
                        ImportOperation[o as keyof typeof ImportOperation],
                        ImportState[s as keyof typeof ImportState]));
            }
        }
    }

    ngOnDestroy() {
        this.list_scripts.forEach((value, index) => {
            delete this.list_scripts[index];
        })
        this.list_files_upload.forEach((value, index) => {
            this.list_files_upload[index].ngOnDestroy();
            delete this.list_files_upload[index];
        });
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Handler for file upload browser
     * @param files: list of binaries to upload
     */
    onFileBrowse(files: any[]) {
        for (let file of files) {
            this.list_files_upload.push(new ListEntry(this._importerService, file, this.script_selected));
        }
        $('#FileInput').val(''); // delete held item of file browser
    }

    /**
     * If file exists in backend, sent delete request, then delete entry from list_files_upload
     * @param index: index of file in list_files_upload
     */
    confirmDelete(index: number) {
        let buttons = [['Löschen', 'green'], ['Abbrechen', 'orange']];
        this.popUpDeleteConfirm.setConfirm(buttons);
        this.popUpDeleteConfirm.onTop = true;
        this.popUpDeleteConfirm.setData(true, 'Eintrag löschen',
            'Wollen Sie diesen Eintrag wirklich unwiderruflich löschen?\nAlle importierten Daten werden ebenso gelöscht!',
            (submit: boolean) => {
                if (submit) {
                    this.deleteFile(index);
                }
            }
        );
    }

    deleteFile(index: number) {
        if (this.list_files_upload[index].getUUID() !== "") {
            this.list_files_upload[index].deleteFile();
        }
        this.list_files_upload.splice(index, 1);
    }

    /**
     * Format file size in view
     * @param bytes: file size in bytes
     * @returns input bytes converted to corresponding measurement
     */
    formatBytes(bytes: number) {
        if (bytes === 0) { return '0 Bytes'; }
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Sort table in view to corresponding header and switch current sorting type (ascending <-> descending)
     * @param attr: table header
     */
    setSortAttribute(attr: string) {
        if (this.sortAttribute === attr) {
            this.reverse = !this.reverse;
        }
        this.sortAttribute = attr;
    }

    /**
     * @returns current sorted table header with sorting type (ascending/descending)
     */
    getSortAttribute() {
        if (this.reverse) {
            return '-' + this.sortAttribute;
        } else {
            return '+' + this.sortAttribute;
        }
    }
}
