/**
 * class to display list entries in HTML
 */
import { ImporterService } from './importer.service';
 import { Subject } from 'rxjs/Subject';
 import { Subscription } from 'rxjs/Subscription';

 import { ImportState } from './ImportState';

 // TODO: comments
 export class ListEntry {

     // TODO onleave 
     private ngUnsubscribe: Subject<void> = new Subject<void>();

     state: ImportState = ImportState.ready;
     name: string;
     size: number;
     uuid = '';
     id_progress_bar: string = Math.random().toString(36).substr(2, 9);

     messages_error: any[] = [];
     messages_warning: any[] = [];

     show_error: Boolean = false;
     show_warning: Boolean = false;

     constructor(
         private _importerService: ImporterService,
         public file: File,
         ) { 
         this.name = file.name,
         this.size = file.size
     }

     upload_and_verificate() {
         // TODO in queue
         this.state = ImportState.uploading;
         this._importerService.uploadFile(this.file, this.id_progress_bar)
         .takeUntil(this.ngUnsubscribe)
         .subscribe(event => {
             this.state = ImportState.verifying;
             this.uuid = event._body;

             this._importerService.verifyFile(this.uuid)
             .subscribe(event => {
                 this.state = ImportState.verification_successful;
             }, (error: any) => {

                 this.state = ImportState.verification_failed;
                 this.messages_error.push({timestamp: new Date(), text: error});
             });

         }, (error: any) => {
             this.state = ImportState.upload_failed;
                 this.messages_error.push({ timestamp: new Date(), text: error });
         });
     }




     import() {
         // TODO
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
         } else if (this.state === ImportState.importing) {
             this.state = ImportState.import_cancelled;
         }
         $('#' + this.id_progress_bar).progress('reset');
         this.ngUnsubscribe.next();
     }

     delete() {
         this.ngUnsubscribe.complete();
         this._importerService.deleteFile(this.uuid)
         .subscribe(event => {
             console.log(event);
         }, (error: any) => {
                 this.messages_error.push({ timestamp: new Date(), text: error });
         });
     }

     ngOnDestroy() {
         this.ngUnsubscribe.next();
         this.ngUnsubscribe.complete();
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
