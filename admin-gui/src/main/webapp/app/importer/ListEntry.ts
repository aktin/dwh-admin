/**
 * class to display table list entries in HTML
 */
import { ImporterService } from './importer.service';
import { Subject } from 'rxjs/Subject';

import { ImportState } from './enums/ImportState';
import { ImportOperation } from './enums/ImportOperation';
import { ImportOperationState } from './enums/ImportOperationState';
import { PropertiesKey } from './enums/PropertiesKey';
import { LogType } from './enums/LogType';

// TODO: comments
export class ListEntry {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    private operationState: ImportOperationState;
    private msg_error: string = '';
    private msg_output: string = '';

    private show_error: boolean = false;
    private show_output: boolean = false;

    private timer_interval = 5000;
    private call_interval: any;

    private perm_write: boolean = false;


    constructor(
        private _importerService: ImporterService,
        private file: File,
        private id_script: string,
        private name_file: string = file.name,
        private size_file: number = file.size,
        private uuid: string = '',
        private operation: ImportOperation = ImportOperation.uploading,
        private state: ImportState = ImportState.ready,
    ) {
        this.computeOperationState();
        if (this.uuid) {
            this.getScriptLogs();
            this.call_interval = setInterval(() => this.reload(), this.timer_interval);
        }
        this.perm_write = this.isAuthorized('WRITE_P21');
    }

    uploadFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.setOperationState(ImportOperation.uploading, ImportState.in_progress);
            this._importerService.uploadFile(this.file, this.name_file, this.id_script)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(event => {
                    this.uuid = event._body; //TODO
                    this.file = null;
                    this.setOperationState(ImportOperation.uploading, ImportState.successful);
                    this.call_interval = setInterval(() => this.reload(), this.timer_interval);// TODO
                }, (error: any) => {
                    this.setOperationState(ImportOperation.uploading, ImportState.failed);
                    console.log(error);
                });
        }
    }

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

    deleteFile() {
        if (this.isAuthorized('WRITE_P21')) {
            this.ngOnDestroy();
            this._importerService.deleteFile(this.uuid)
                .subscribe(event => {
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    getUUID(): string {
        return this.uuid;
    }

    reload() {
        this._importerService.getUploadedFile(this.uuid)
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
                    console.log("PING " + this.uuid); // TODO REMOVE
                }
            }, (error: any) => {
                console.log(error);
            })
    }

    setOperationState(operation: ImportOperation, state: ImportState) {
        this.operation = operation;
        this.state = state;
        this.computeOperationState();
    }

    computeOperationState() {
        this.operationState = ImportOperationState[[this.operation, this.state].join("_") as keyof typeof ImportOperationState]
    }

    getScriptLogs() {
        this._importerService.getScriptLogs(this.uuid)
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
                }
            }, (error: any) => {
                console.log(error);
            })
    }

    ngOnDestroy() {
        console.log("I AM CALLED") //TODO
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        clearInterval(this.call_interval);
    }

    checkButtonVisibility(operation_prev: ImportOperation, operation: ImportOperation): boolean {
        if (this.operation === operation_prev && this.state === ImportState.successful) {
            return true;
        } else if (this.operation === operation && this.state === ImportState.successful) {
            return false;
        } else if (this.operation === operation) {
            return true;
        } else {
            return false;
        }
    }

    /**
  * Checks if the user has the given permission.
  * @returns the permission that will be checked
  */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }

}
