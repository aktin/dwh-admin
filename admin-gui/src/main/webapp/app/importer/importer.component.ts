import { Component, ViewChild, forwardRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/observable/of'
import 'rxjs/operator/delay';

import { PopUpMessageComponent } from './../helpers/popup-message.component';

import { ImporterService } from './importer.service';
import { ListEntry } from './ListEntry';

import { ImportState } from './enums/ImportState';
import { ImportOperation } from './enums/ImportOperation';
import { PropertiesKey } from './enums/PropertiesKey';
import { ScriptKey } from './enums/ScriptKey';

require('semantic-ui');

@Component({
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
})

export class ImporterComponent {

    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpDeleteConfirm: PopUpMessageComponent = new PopUpMessageComponent();

    private ngUnsubscribe: Subject<void> = new Subject<void>(); // object to cancel subscriptions

    // hashmap for uploaded scripts by <ScriptId:DisplayName>
    private script_selected: string;
    private list_scripts: Map<string, string> = new Map<string, string>();

    // lists for uploaded files
    private list_files_upload: ListEntry[] = [];

    // table sorting
    private sortAttribute = 'name_file';
    private reverse = true; // sort order ascending/descending
    private sorted = false;

    // initialization of enum classes
    // used to access enums in html
    public importState: typeof ImportState = ImportState;
    public importOperation: typeof ImportOperation = ImportOperation;

    private perm_write: boolean = false;

    /**
     * Constructor for importer.component with two GET requests
     * First GET: Requests uploaded script metadata from backend. Gets a json list of
     * uploaded scripts and converts it to a list of string maps with <ID, name+version>
     * (for example. <"script1.py", "importer V1.0">). List is used to view and select
     * uploaded scripts from dropdown menu.
     * Second GET: Requests uploaded file metadata from backend. Gets a json list of
     * uploaded files and converts it to a list of ListEntry(s). List is used to
     * view uploaded files in table and select file operations
     * @param _importerService: injected service to perform requests and check permissions
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
        this.perm_write = this.isAuthorized('WRITE_P21');
    }


    /**
     * Handler for file browser button
     * Opens file browser in view and allows selection of file to upload. Selected files are
     * added as entries to list_files_upload
     * @param files: list of binaries to upload
     */
    onFileBrowse(files: any[]) {
        if (this.isAuthorized('WRITE_P21')) {
            for (let file of files) {
                this.list_files_upload.push(new ListEntry(this._importerService, file, this.script_selected));
            }
            $('#FileInput').val(''); // delete held item of file browser afterwards
        }
    }

    /**
     * Delete request for entries in table
     * Opens delete confirmation popup when called. If confirmed and file exists in backend (== has uuid),
     * delete request is sent to backend. If file does not exists in backend or delete request was
     * successful, entry is deleted from list_files_upload
     * @param listEntry: ListEntry object to delete/remove from list_files_upload
     */
    confirmDelete(listEntry: ListEntry) {
        if (this.isAuthorized('WRITE_P21')) {
            let buttons = [['Löschen', 'green'], ['Abbrechen', 'orange']];
            this.popUpDeleteConfirm.setConfirm(buttons);
            this.popUpDeleteConfirm.onTop = true;
            this.popUpDeleteConfirm.setData(true, 'Eintrag löschen',
                'Wollen Sie diesen Eintrag wirklich unwiderruflich löschen?\nAlle importierten Daten werden ebenso gelöscht!',
                (submit: boolean) => {
                    if (submit) {
                        if (listEntry.getUUID() !== "") {
                            listEntry.deleteFile();
                        }
                        this.list_files_upload = this.list_files_upload.filter(entry => entry !== listEntry);
                    }
                }
            );
        }
    }

    /**
     * Formats binary file size for view
     * @param bytes: file size in bytes
     * @returns input bytes converted to corresponding measurement
     */
    formatBytes(bytes: number) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB'];
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Sorts table in view after giving attribute (table header). Switches sorting type (ascending <-> descending),
     * if same attribute is selected again.
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

    /**
     * PreDestroy method call
     * Clears list of script metadata and list of file metadata and unsubscribes from all ongoing
     * subscriptions (including subscriptions of ListEntry objects)
     */
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
     * Checks user permission via importer.service
     * @param permission enum of Permissions.ts as string
     * @returns boolean if current user has requested permission
     */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }
}
