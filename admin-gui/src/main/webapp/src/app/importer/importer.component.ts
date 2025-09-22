import {Component, OnDestroy, OnInit} from '@angular/core';

import {ImporterService} from './importer.service';
import {UploadedFile} from './ListEntry';

import {ImportState} from './enums/ImportState';
import {ImportOperation} from './enums/ImportOperation';
import {ImportScript} from './enums/ScriptKey';
import {ImportOperationState} from './enums/ImportOperationState';
import {NotificationService, PopUpMessageComponent, TableColumns} from '../helpers';
import {ImportOperationStatePipe} from './enums/import-operation-state.pipe';
import {LogType} from './enums/LogType';
import {iif, interval, of, Subscription, switchMap, take, tap} from 'rxjs';
import {ModalService} from '../helpers/modal/modal.service';
import {filter, finalize, map} from 'rxjs/operators';

@Component({
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
    providers: [ImportOperationStatePipe]
})
export class ImporterComponent implements OnInit, OnDestroy {
    public columns: TableColumns<UploadedFile> = [
        {header: 'Name', field: 'name_file'},
        {header: 'Größe', field: f => this.formatBytes(f.size_file)},
        {header: 'Skript', field: f => this.scripts.find(s => s.id === f.id_script)?.viewname},
        {header: 'Status', field: f => this._operationStatePipe.transform(f.operationState)},
    ];

    public selectedScript: ImportScript;
    protected scripts: ImportScript[];

    // lists for uploaded files
    protected uploadedFiles: UploadedFile[] = [];

    // browsed file to upload
    protected fileToUpload: File = null;
    protected fileToUploadOperationState: ImportOperationState;

    // initialization of enum classes
    // used to access enums in html
    public ImportState: typeof ImportState = ImportState;
    public ImportOperation: typeof ImportOperation = ImportOperation;
    public ImportOperationState: typeof ImportOperationState = ImportOperationState;

    protected hasWritePermission: boolean = false;
    public page: number;

    private readonly refreshInterval: number = 1000;
    private sub: Subscription;


    /**
     *
     * @param _importerService injected service to perform requests and check permissions
     * @param _operationStatePipe
     * @param _notificationService
     * @param _modalService
     */
    constructor(private _importerService: ImporterService,
                private _operationStatePipe: ImportOperationStatePipe,
                private _notificationService: NotificationService,
                private _modalService: ModalService,) {
    }

    ngOnInit(): void {
        //keep refreshing file table if any file is waiting for an import to finish
        this.sub = interval(this.refreshInterval)
            .pipe(filter(() => this.uploadedFiles?.some(f => [ImportState.Queued, ImportState.InProgress].includes(f.state))))
            .subscribe(() => this.reload());


        this.reload();
        this.hasWritePermission = this.isAuthorized('WRITE_P21');
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    /**
     * First GET: Requests uploaded script metadata from backend. Gets a json list of
     * uploaded scripts and converts it to a list of string maps with <ID, name+version>
     * (for example. <"script1.py", "importer V1.0">). List is used to view and select
     * uploaded scripts from dropdown menu.
     * Second GET: Requests uploaded file metadata from backend. Gets a json list of
     * uploaded files and converts it to a list of ListEntry(s). List is used to
     * view uploaded files in table and select file operations
     */
    public reload(): void {
        this._importerService.getImportScripts()
            .subscribe(scripts => {
                this.scripts = scripts;
                if (!!this.scripts?.length) {
                    this.selectedScript = this.scripts[0];
                }
            });
        this._importerService.getUploadedFiles()
            .subscribe(files => this.uploadedFiles = files);
    }

    /**
     * Handler for file browser button
     * Opens file browser in view and allows selection of file to upload.
     * Selected file is held in a variable and allows uploading of it
     * @param files list of binaries to upload
     */
    onFileBrowse(files: FileList) {
        if (this.hasWritePermission) {
            this.fileToUpload = files[0];
            this.fileToUploadOperationState = ImportOperationState.UploadingReady;
        }
    }

    /**
     * Deletes the currently held file from cache
     * Clears the variable and operationState
     */
    deleteHoldingFile() {
        if (this.hasWritePermission) {
            this.fileToUpload = null;
            this.fileToUploadOperationState = null;
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
        if (this.hasWritePermission && this.fileToUpload !== null) {
            this.fileToUploadOperationState = ImportOperationState.UploadingInProgress;
            let lock_script = this.selectedScript;
            let lock_file = this.fileToUpload;
            this._importerService.uploadFile(lock_file, lock_file.name, lock_script.id)
                .pipe(finalize(() => this.reload()))
                .subscribe({
                    next: event => {
                        this.uploadedFiles.push(new UploadedFile(
                            lock_script.id,
                            lock_file.name,
                            lock_file.size,
                            event
                        ));
                        this.deleteHoldingFile();
                    }, error: (error: any) => {
                        this.fileToUploadOperationState = ImportOperationState.UploadingFailed;
                    }
                });
        }
    }

    /**
     * Completes all ongoing subscriptions aka cancels file upload subscription
     * (GET subscriptions are only called once during view initialization)
     */
    cancelHoldingFileUpload() {
        if (this.isAuthorized('WRITE_P21') && this.fileToUpload !== null) {
            this._importerService.cancelUpload();
            this.fileToUploadOperationState = ImportOperationState.UploadingCancelled;
        }
    }

    /**
     * Delete request for entries in table
     * Opens delete confirmation popup when called. If confirmed, delete request is sent to backend and entry
     * is deleted from list_files_upload
     * @param file ListEntry object to delete/remove from list_files_upload
     */
    confirmDelete(file: UploadedFile) {
        if (this.hasWritePermission) {
            this._modalService.open(PopUpMessageComponent)
                .pipe(
                    tap(ref => {
                        ref.instance.button = ['user minus icon icon', 'Löschen', 'primary'];
                        ref.instance.head = 'Datei löschen';
                        ref.instance.message = 'Möchten Sie die hochgeladene Datei unwideruflich löschen?';
                        ref.instance.mode = 'confirm';
                        ref.instance.show = true;
                    }), switchMap(ref => ref.closed$),
                    switchMap(shouldDelete => iif(() => shouldDelete,
                        this._importerService.deleteFile(file.getUUID()),
                        of(false)
                    )),
                    take(1), // making sure the observable completes
                    finalize(() => this.reload()))
                .subscribe({
                    next: wasDeleted => {
                        //explicit false check because deleteEntry returns null
                        if (wasDeleted !== false) {
                            this._notificationService.showSuccess('Datei gelöscht');
                        }
                    }, error: e => this._notificationService.showError('Datei konnte nicht gelöscht werden'),
                });
        }
    }

    public showErrorLog(file: UploadedFile): void {
        this._importerService.getScriptLogs(file.getUUID())
            .pipe(map(logs => logs.find(l => l.type === LogType.stdError)))
                         .subscribe(log => this.showLog(LogType.stdError, log?.text));
    }

    public showStdLog(file: UploadedFile): void {
        this._importerService.getScriptLogs(file.getUUID())
            .pipe(map(logs => logs.find(l => l.type === LogType.stdOutput)))
            .subscribe(log => this.showLog(LogType.stdOutput, log?.text));
    }

    private showLog(type: LogType, log: string): void {
        if(!log?.length) {
            this._notificationService.showInfo("Keine Ausgabe vorhanden");
            return;
        }

        const head = type === LogType.stdOutput ? 'Konsolenausgabe' : 'Fehlerausgabe';
        this._modalService.open(PopUpMessageComponent)
            .pipe(tap(ref => {
                ref.instance.head = head;
                ref.instance.message = log;
                ref.instance.mode = 'info';
                ref.instance.show = true;
            }), switchMap(ref => ref.closed$),
                take(1),
                finalize(() => this.reload()))
            .subscribe();
    }

    /**
     * Formats binary file size for view
     * @param bytes file size in bytes
     * @returns input bytes converted to corresponding measurement
     */
    public formatBytes(bytes: number): string {
        let sizes = ['Bytes', 'KB', 'MB', 'GB'];
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Checks user permission via importer.service
     * @param permission enum of Permissions.ts as string
     * @returns boolean if current user has requested permission
     */
    isAuthorized(permission: string) {
        return this._importerService.checkPermission(permission);
    }

    protected compareScripts: (a: any, b: any) => boolean = (a: ImportScript, b: ImportScript) => !!a && !!b && a.id === b.id;

    /**
     * Starts async file import process via importer.service
     * Only a request to backend to start file import of given id
     * @param file file to import
     */
    public importFile(file: UploadedFile): void {
        if (this.hasWritePermission) {
            this._importerService.importFile(file.getUUID())
                .pipe(finalize(() => this.reload()))
                .subscribe({
                    next: () => {
                        this._notificationService.showSuccess('Import eingereiht');
                        file.setOperationState(ImportOperation.Importing, ImportState.Queued);
                    },
                    error: () => {
                        this._notificationService.showError('Import fehlgeschlagen');
                        file.setOperationState(ImportOperation.Importing, ImportState.Failed);
                    },
                });
        }
    }

    /**
     * Requests backend to cancel current file processing of given file id
     */
    public cancelProcess(file: UploadedFile): void {
        if (this.hasWritePermission) {
            this._importerService.cancelProcess(file.getUUID())
                .pipe(finalize(() => this.reload()))
                .subscribe({
                    next: () => {
                        this._notificationService.showSuccess('Import abgebrochen');
                        if ([ImportOperationState.ImportingQueued, ImportOperationState.ImportingInProgress].includes(file.operationState)) {
                            file.setOperationState(ImportOperation.Importing, ImportState.Cancelled);
                        }
                    }, error: e => this._notificationService.showError('Import abbrechen fehlgeschlagen'),
                });
        }
    }
}
