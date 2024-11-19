import { Subscription } from 'rxjs';

import { ImporterService } from './importer.service';

import { ImportState } from './enums/ImportState';
import { ImportOperation } from './enums/ImportOperation';
import { ImportOperationState } from './enums/ImportOperationState';
import { PropertiesKey } from './enums/PropertiesKey';
import { LogType } from './enums/LogType';

/**
 * Displays uploaded files in view and manages file operations for corresponding file
 * Each instance of ListEntry represents one row in html table
 */
export class ListEntry {

    private subscription_import: Subscription;
    private subscription_cancel: Subscription;
    private subscription_delete: Subscription;
    private subscription_reload: Subscription;
    private subscription_scriptLogs: Subscription;

    private msg_error: string = '';
    private msg_output: string = '';
    private show_error: boolean = false;
    private show_output: boolean = false;

    private operationState: ImportOperationState;

    private timer_interval = 5000;
    private call_interval: any;

    private perm_write: boolean = false;

    constructor(
        private _importerService: ImporterService,
        private id_script: string,
        public name_file: string,
        private size_file: number,
        private uuid: string,
        private operation: ImportOperation = ImportOperation.uploading,
        private state: ImportState = ImportState.successful,
    ) {
        this.computeOperationState();
        this.perm_write = this.isAuthorized('WRITE_P21');
        this.getScriptLogs();
        this.call_interval = setInterval(() => this.reload(), this.timer_interval);
    }

    /**
     * Starts async file import process via importer.service
     * Only a request to backend to start file import of given id
     */
    importFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.subscription_import = this._importerService.importFile(this.uuid)
                .subscribe(event => {
                    this.setOperationState(ImportOperation.importing, ImportState.queued);
                    this.subscription_import.unsubscribe();
                }, (error: any) => {
                    this.setOperationState(ImportOperation.importing, ImportState.failed);
                    console.log(error);
                });
        }
    }

    /**
     * Requests backend to cancel current file processing of given file id
     */
    cancelProcess() {
        if (this.isAuthorized('WRITE_P21')) {
            this.subscription_cancel = this._importerService.cancelProcess(this.uuid)
                .subscribe(event => {
                    switch (this.operationState) {
                        case ImportOperationState.importing_queued:
                        case ImportOperationState.importing_in_progress:
                            this.setOperationState(ImportOperation.importing, ImportState.cancelled);
                            break;
                    }
                    this.subscription_cancel.unsubscribe();
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    /**
    * Deletes uploaded file data via importer.service
    * Cancels all subscription of this object and requests deletion of file via importer.service
    */
    deleteFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.ngOnDestroy();
            this.subscription_delete = this._importerService.deleteFile(this.uuid)
                .subscribe(event => {
                    this.subscription_delete.unsubscribe();
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    /**
    * GET request to backend for metadata of this file, as well as created script logs
    * Used to update information in view consistently. As reload() is called in an interval, a new
    * subscription would be created each call. To avoid this, a subscription variable is reused
    * and unsubscribed after each first response from observable
    */
    reload() {
        this.subscription_reload = this._importerService.getUploadedFile(this.uuid)
            .subscribe(event => {
                if (event._body) {
                    let json = JSON.parse(event._body);
                    this.id_script = json[PropertiesKey.script]
                    this.name_file = json[PropertiesKey.filename]
                    this.size_file = json[PropertiesKey.size]
                    this.uuid = json[PropertiesKey.id]
                    this.operation = json[PropertiesKey.operation]
                    this.state = json[PropertiesKey.state]
                    this.computeOperationState();
                    this.getScriptLogs();
                    this.subscription_reload.unsubscribe();
                }
            }, (error: any) => {
                console.log(error);
            })
    }

    /**
     * GET request for created script logs to this file.
     * Response from observable is saved to msg_error and msg_output. Is called by reload()
     * in an interval. Like with reload() a subscription variable is reused each iteration
     */
    getScriptLogs() {
        this.subscription_scriptLogs = this._importerService.getScriptLogs(this.uuid)
            .subscribe(event => {
                if (event._body) {
                    let list_logs = JSON.parse(event._body);
                    list_logs.forEach((json: any) => {
                        if (json['type'] == LogType.stdError && json['text'] != null) {
                            this.msg_error = json['text'];
                        } else if (json['type'] == LogType.stdOutput && json['text'] != null) {
                            this.msg_output = json['text'];
                        }
                    })
                    this.subscription_scriptLogs.unsubscribe();
                }
            }, (error: any) => {
                console.log(error);
            })
    }

    /**
     * Sets operation and state of this file to given values and computes new ImportOperationState
     * @param operation ImportOperation enum
     * @param state ImportState enum
     */
    setOperationState(operation: ImportOperation, state: ImportState) {
        this.operation = operation;
        this.state = state;
        this.computeOperationState();
    }

    /**
     * Merges values of current operation and current state to new enum ImportOperationState
     */
    computeOperationState() {
        this.operationState = ImportOperationState[[this.operation, this.state].join("_") as keyof typeof ImportOperationState]
    }

    /**
     * Checks if button "import" should be shown or hidden, is shown during all import operations.
     * Is also shown after successful verification
     * @returns boolean if button shall be shown or hidden
     */
    checkImportButtonVisibility(): boolean {
        if (this.operation === ImportOperation.uploading && this.state === ImportState.successful) {
            return true;
        } else if (this.operation === ImportOperation.importing) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * PreDestroy method call
     * Unsubscribes from all ongoing subscriptions and cancels interval call of reload()
     */
    ngOnDestroy() {
        clearInterval(this.call_interval);
        if (this.subscription_import)
            this.subscription_import.unsubscribe();
        if (this.subscription_cancel)
            this.subscription_cancel.unsubscribe();
        if (this.subscription_reload)
            this.subscription_reload.unsubscribe();
        if (this.subscription_scriptLogs)
            this.subscription_scriptLogs.unsubscribe();
    }

    /**
     * Checks user permission via importer.service
     * @param permission enum of Permissions.ts as string
     * @returns boolean if current user has requested permission
     */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }

    /**
     * @returns uuid of object
     */
    getUUID(): string {
        return this.uuid;
    }
}
