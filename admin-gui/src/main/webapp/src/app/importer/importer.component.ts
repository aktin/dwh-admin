import {Component, forwardRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';


import {PopUpMessageComponent} from './../helpers/popup-message.component';

import {ImporterService} from './importer.service';
import {ListEntry} from './ListEntry';

import {ImportState} from './enums/ImportState';
import {ImportOperation} from './enums/ImportOperation';
import {PropertiesKey} from './enums/PropertiesKey';
import {ScriptKey} from './enums/ScriptKey';
import {ImportOperationState} from './enums/ImportOperationState';

//require('semantic-ui');

@Component({
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
})

export class ImporterComponent {

    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpDeleteConfirm: PopUpMessageComponent = new PopUpMessageComponent();

    private subscription_upload: Subscription;
    private subscription_files: Subscription;
    private subscription_scripts: Subscription;

    // hashmap for uploaded scripts by <ScriptId:DisplayName>
    public script_selected: string;
    protected list_scripts: Map<string, string> = new Map<string, string>();

    // lists for uploaded files
    protected list_files_upload: ListEntry[] = [];

    // table sorting
    protected sortAttribute = 'name_file';
    protected reverse = true; // sort order ascending/descending
    protected sorted = false;

    // browsed file to upload
    protected currentFile: any = null;
    protected currentFile_name = '';
    protected currentFile_OperationState: ImportOperationState;

    // initialization of enum classes
    // used to access enums in html
    public importState: typeof ImportState = ImportState;
    public importOperation: typeof ImportOperation = ImportOperation;
    public importOperationState: typeof ImportOperationState = ImportOperationState;

    protected perm_write: boolean = false;
    public page: number;

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
        this.subscription_scripts = this._importerService.getImportScripts()
            .subscribe(event => {
                if (event._body) {
                    let list_json = JSON.parse(event._body);
                    list_json.forEach((json: any) => {
                        this.list_scripts.set(json[ScriptKey.id], [json[ScriptKey.viewname], " ", "V", json[ScriptKey.version]].join(""));
                    });
                    this.script_selected = Array.from(this.list_scripts)[0][0];
                }
                this.subscription_scripts.unsubscribe();
            }, (error: any) => {
                console.log(error);
            });
        this.subscription_files = this._importerService.getUploadedFiles()
            .subscribe(event => {
                if (event._body) {
                    let list_json = JSON.parse(event._body);
                    list_json.forEach((json: any) => {
                        this.list_files_upload.push(
                            new ListEntry(
                                this._importerService,
                                json[PropertiesKey.script],
                                json[PropertiesKey.filename],
                                json[PropertiesKey.size],
                                json[PropertiesKey.id],
                                ImportOperation[json[PropertiesKey.operation] as keyof typeof ImportOperation],
                                ImportState[json[PropertiesKey.state] as keyof typeof ImportState]));
                    });
                }
                this.subscription_files.unsubscribe();
            }, (error: any) => {
                console.log(error);
            });
        this.perm_write = this.isAuthorized('WRITE_P21');
    }

    /**
     * Handler for file browser button
     * Opens file browser in view and allows selection of file to upload.
     * Selected file is held in a variable and allows uploading of it
     * @param files: list of binaries to upload
     */
    onFileBrowse(files: any[]) {
        if (this.isAuthorized('WRITE_P21')) {
            this.currentFile = files[0];
            this.currentFile_name = this.currentFile.name;
            this.currentFile_OperationState = ImportOperationState.uploading_ready;
            $('#file').val(''); // delete held item of file browser
        }
    }

    /**
     * Deletes the currently held file from cache
     * Clears the variable and operationState
     */
    deleteHoldingFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.currentFile = null;
            this.currentFile_name = '';
            this.currentFile_OperationState = null;
        }
    }

    /**
    * Upload currently held file via importer.service
    * Process is done via subscription (can be cancelled using .takeUntil)
    * Metadata of file is converted to a ListEntry object after succesful
    * upload and added to list_files_upload, binary file itself is deleted
    * from cache after success
    * Lock_script and Lock_file are used as temporary variables, as
    * script and files could be reselected during long uploads
    */
    uploadHoldingFile() {
        if (this.isAuthorized('WRITE_P21') && this.currentFile !== null) {
            this.currentFile_OperationState = ImportOperationState.uploading_in_progress;
            let lock_script = this.script_selected;
            let lock_file = this.currentFile;
            this.subscription_upload = this._importerService.uploadFile(lock_file, lock_file.name, lock_script)
                .subscribe(event => {
                    this.list_files_upload.push(new ListEntry(
                        this._importerService,
                        lock_script,
                        lock_file.name,
                        lock_file.size,
                        event._body
                    ));
                    this.deleteHoldingFile();
                    this.subscription_upload.unsubscribe();
                }, (error: any) => {
                    this.currentFile_OperationState = ImportOperationState.uploading_failed;
                    console.log(error);
                });
        }
    }

    /**
     * Completes all ongoing subscriptions aka cancels file upload subscription
     * (GET subscriptions are only called once during view initialization)
     */
    cancelHoldingFileUpload() {
        if (this.isAuthorized('WRITE_P21') && this.currentFile !== null) {
            this.subscription_upload.unsubscribe();
            this.currentFile_OperationState = ImportOperationState.uploading_cancelled;
        }
    }

    /**
     * Delete request for entries in table
     * Opens delete confirmation popup when called. If confirmed, delete request is sent to backend and entry
     * is deleted from list_files_upload
     * @param listEntry: ListEntry object to delete/remove from list_files_upload
     */
    confirmDelete(listEntry: ListEntry) {
        if (this.isAuthorized('WRITE_P21')) {
            let buttons = ['trash icon', 'Löschen', 'red'];
            this.popUpDeleteConfirm.setConfirm(buttons);
            this.popUpDeleteConfirm.onTop = true;
            this.popUpDeleteConfirm.setData(true, 'Datei löschen',
                'Wollen Sie diese Datei wirklich unwiderruflich löschen?\nAlle importierten Daten werden ebenso gelöscht!',
                (submit: boolean) => {
                    if (submit) {
                        listEntry.deleteFile();
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
            // @ts-ignore
            delete this.list_scripts[index];
        })
        this.list_files_upload.forEach((value, index) => {
            this.list_files_upload[index].ngOnDestroy();
            delete this.list_files_upload[index];
        });
        if (this.subscription_scripts)
            this.subscription_scripts.unsubscribe();
        if (this.subscription_files)
            this.subscription_files.unsubscribe();
        if (this.subscription_upload)
            this.subscription_upload.unsubscribe();
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
