import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { ImporterService } from './importer.service';

import { ImportState } from './enums/ImportState';
import { ImportOperation } from './enums/ImportOperation';
import { ImportOperationState } from './enums/ImportOperationState';
import { PropertiesKey } from './enums/PropertiesKey';
import { LogType } from './enums/LogType';

/**
 * Displays uploaded and to be uploaded files in view and
 * manages file operations for corresponding file
 * Each instance of ListEntry represents one row in html table
 */
export class ListEntry {

    private ngUnsubscribe: Subject<void> = new Subject<void>(); // object to cancel subscriptions
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
        private file: File,
        private id_script: string,
        public name_file: string = file.name,
        private size_file: number = file.size,
        private uuid: string = '',
        private operation: ImportOperation = ImportOperation.uploading,
        private state: ImportState = ImportState.ready,
    ) {
        this.computeOperationState();
        this.perm_write = this.isAuthorized('WRITE_P21');
        if (this.uuid) {
            this.getScriptLogs();
            this.call_interval = setInterval(() => this.reload(), this.timer_interval);
        }
    }

    /**
     * Upload file via importer.service
     * Process is done via subscription (can be cancelled using .takeUntil)
     * Deletes binary file from this object after successful upload and creates an
     * interval to call reload() every {timer_interval} ms. Prior upload, file metadata
     * is read via binary file and after upload via endpoint calls (by reload())
     */
    uploadFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.setOperationState(ImportOperation.uploading, ImportState.in_progress);
            this._importerService.uploadFile(this.file, this.name_file, this.id_script)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(event => {
                    this.uuid = event._body;
                    this.setOperationState(ImportOperation.uploading, ImportState.successful);
                    this.call_interval = setInterval(() => this.reload(), this.timer_interval);
                    this.file = null;
                }, (error: any) => {
                    this.setOperationState(ImportOperation.uploading, ImportState.failed);
                    console.log(error);
                });
        }
    }

    /**
     * Starts async file verification process via importer.service
     * Only a request to backend to verify file by given id
     */
    verifyFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this._importerService.verifyFile(this.uuid)
                .subscribe(event => {
                    this.setOperationState(ImportOperation.verifying, ImportState.queued);
                }, (error: any) => {
                    this.setOperationState(ImportOperation.verifying, ImportState.failed);
                    console.log(error);
                });
        }
    }

    /**
     * Starts async file import process via importer.service
     * Only a request to backend to import file by given id
     */
    importFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this._importerService.importFile(this.uuid)
                .subscribe(event => {
                    this.setOperationState(ImportOperation.importing, ImportState.queued);
                }, (error: any) => {
                    this.setOperationState(ImportOperation.importing, ImportState.failed);
                    console.log(error);
                });
        }
    }

    /**
     * Cancels current file processing by case differentiation
     * case upload: Cancels subscription of upload
     * case verify/import: Sends a request to backend to stop processing of given file id
     */
    cancelProcess() {
        if (this.isAuthorized('WRITE_P21')) {
            if (!this.uuid) {
                this.ngUnsubscribe.complete();
                this.setOperationState(ImportOperation.uploading, ImportState.cancelled);
            } else {
                this._importerService.cancelProcess(this.uuid)
                    .subscribe(event => {
                        switch (this.operationState) {
                            case ImportOperationState.verifying_queued:
                            case ImportOperationState.verifying_in_progress:
                                this.setOperationState(ImportOperation.verifying, ImportState.cancelled);
                                break;
                            case ImportOperationState.importing_queued:
                            case ImportOperationState.importing_in_progress:
                                this.setOperationState(ImportOperation.importing, ImportState.cancelled);
                                break;
                        }
                    }, (error: any) => {
                        console.log(error);
                    });
            }
        }
    }

    /**
    * Deletes uploaded file data via importer.service (only if file has a uuid and is therefore uploaded)
    * Cancels all subscription of this object and requests deletion of file via importer.service
    */
    deleteFile() {
        if (this.isAuthorized('WRITE_P21')) {
            if (this.uuid) {
                this.ngOnDestroy();
                this._importerService.deleteFile(this.uuid)
                    .subscribe(event => {
                    }, (error: any) => {
                        console.log(error);
                    });
            }
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
     * Checks current operation and current state of object against given input. Used
     * to hide/show file operation buttons in view. Each operation button is shown with
     * the success of the previous operation and hidden with the success of its own
     * operation, example:
     * Upload success -> upload button hidden, verify button shown
     * Verify success -> verify button hidden, import button shown
     * @param operation_prev previous operation (upload or verify)
     * @param operation current operation (verify or import)
     * @returns boolean if button shall be shown or hidden
     */
    checkVerifyButtonVisibility(): boolean {
        if (this.operation === ImportOperation.uploading && this.state === ImportState.successful) {
            return true;
        } else if (this.operation === ImportOperation.verifying && this.state === ImportState.successful) {
            return false;
        } else if (this.operation === ImportOperation.verifying) {
            return true;
        } else {
            return false;
        }
    }

    checkImportButtonVisibility(): boolean {
        if (this.operation === ImportOperation.verifying && this.state === ImportState.successful) {
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
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        clearInterval(this.call_interval);
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
