/**
 * class to display list entries in HTML
 */
 import { P21Service } from './p21.service';
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
     progress = 0;
     uuid = '';
     id: string = Math.random().toString(36).substr(2, 9);

     is_error = false;
     error_message: string;

     is_warning = false;
     warning_message: string;

     constructor(
         private _p21service: P21Service,
         public file: File,
         ) { 
         this.name = file.name,
         this.size = file.size
     }

     upload_and_verificate() {
         // TODO in queue
         this.state = ImportState.uploading;
         this._p21service.uploadFile(this.file, this.id)
         .takeUntil(this.ngUnsubscribe)
         .subscribe(event => {
             this.state = ImportState.verificating;
             this.uuid = event._body;
             console.log(this.uuid);

             this.state = ImportState.verification_successful;
             console.log('VERIFICATION');

         }, (error: any) => {
             this.state = ImportState.upload_failed;
             this.is_error = true;
             this.error_message = error;
         });
     }

     import() {

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
         this.ngUnsubscribe.next();
     }

     delete() {
         this.ngUnsubscribe.complete();
         this._p21service.deleteFile(this.uuid)
         .subscribe(event => {
             console.log(event);
         }, (error: any) => {
             this.is_error = true;
             this.error_message = error;
         });
     }

     ngOnDestroy() {
         this.ngUnsubscribe.next();
         this.ngUnsubscribe.complete();
     }


     // TODO FIND A BETTER WAY
     hasState(...states: ImportState[]): boolean {
         for (let state of states) {
             if (this.state === state) {
                 return true;
             }
         }
         return false;
     }

     ping() {
         // TODO
     }



     // TODO: REMOVE
     // $('#' + this.list_files_upload[index].id).progress('increment');
 }
