/**
 * class to display list entries in HTML
 */
import { ImporterService } from './importer.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { ImportState } from './ImportState';

 // TODO: comments
export class ListEntry {

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private id_progress_bar: string = Math.random().toString(36).substr(2, 9);
     
    private messages_error: any[] = [];
    private show_error: boolean = false;
    private messages_warning: any[] = [];
    private show_warning: boolean = false;

    constructor(
        private _importerService: ImporterService,
        private file: File,
        private selected_script: string,
        private name: string = file.name,
        private size: number = file.size,
        private uuid: string = '',
        private state: ImportState = ImportState.ready,
        ) {}

    upload_and_verificate() {
        if (this.uuid === "") {
            this.state = ImportState.uploading;
            this._importerService.uploadFile(this.file, this.name, this.selected_script, this.id_progress_bar)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(event => {
                    this.uuid = event._body;
                    this.file = null;
                    this.verify();
                }, (error: any) => {
                    this.state = ImportState.upload_failed;
                    this.messages_error.push({ timestamp: new Date(), text: error });
                });
        } else {
            this.verify();
        }
    }

    verify() {
        this._importerService.verifyFile(this.uuid)
            .subscribe(event => {
                this.state = ImportState.verifying;
            }, (error: any) => {
                this.state = ImportState.verification_failed;
                this.messages_error.push({ timestamp: new Date(), text: error });
            });
    }

    import() {
        this._importerService.importFile(this.uuid)
            .subscribe(event => {
                this.state = ImportState.importing;
            }, (error: any) => {
                this.state = ImportState.import_failed;
                this.messages_error.push({ timestamp: new Date(), text: error });
            });
    }

    showError() {
        this.show_error = !this.show_error;
    }

    showWarning() {
        this.show_warning = !this.show_warning;
    }

    /**
     * Abort current progress
     * delete entry from list_files_upload list
     * @param index (File index)
     */
     cancel() {
         if (this.state === ImportState.uploading) {
             this.state = ImportState.upload_cancelled;
         } else if (this.state === ImportState.verifying) {
             this.state = ImportState.verification_cancelled;
         } else if (this.state === ImportState.importing) {
             this.state = ImportState.import_cancelled;
         }
         $('#' + this.id_progress_bar).progress('reset');
         this.ngUnsubscribe.next();
     }

// TODO ABORT AT ERROR
     delete() {
         this.ngUnsubscribe.complete();
         this._importerService.deleteFile(this.uuid)
         .subscribe(event => { 
         }, (error: any) => {
                 this.messages_error.push({ timestamp: new Date(), text: error });
         });
     }

     ngOnDestroy() {
         this.ngUnsubscribe.next();
         this.ngUnsubscribe.complete();
     }


     getUUID(): string {
         return this.uuid;
     }


     hasState(...states: ImportState[]): boolean {
         for (let state of states) {
             if (this.state === state) {
                 return true;
             }
         }
         return false;
     }

     hasNotState(...states: ImportState[]): boolean {
         for (let state of states) {
             if (this.state === state) {
                 return false;
             }
         }
         return true;
     }

     // TODO: REMOVE
     // $('#' + this.list_files_upload[index].id).progress('increment');
 }
