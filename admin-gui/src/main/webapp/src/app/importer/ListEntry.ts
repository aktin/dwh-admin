import {Subscription} from 'rxjs';

import {ImporterService} from './importer.service';

import {ImportState} from './enums/ImportState';
import {ImportOperation} from './enums/ImportOperation';
import {ImportOperationState} from './enums/ImportOperationState';
import {PropertiesKey} from './enums/PropertiesKey';
import {LogType} from './enums/LogType';
import {Dir} from 'node:fs';
import {Directive} from '@angular/core';

/**
 * Displays uploaded files in view and manages file operations for corresponding file
 * Each instance of ListEntry represents one row in html table
 */
@Directive()
export class UploadedFile {
    public errorLog: string = '';
    public stdLog: string = '';

    public get operationState(): ImportOperationState {
        return [this.operation, this.state].join('_') as ImportOperationState;
    }

    constructor(
        // private _importerService: ImporterService,
        public id_script: string,
        public name_file: string,
        public size_file: number,
        public uuid: string,
        public operation: ImportOperation = ImportOperation.Uploading,
        public state: ImportState = ImportState.Successful,
    ) {
    }


    /**
     * Sets operation and state of this file to given values and computes new ImportOperationState
     * @param operation ImportOperation enum
     * @param state ImportState enum
     */
    public setOperationState(operation: ImportOperation, state: ImportState): void {
        this.operation = operation;
        this.state = state;
    }

    /**
     * @returns uuid of object
     */
    getUUID(): string {
        return this.uuid;
    }

    public get isImportable() {
        return this.operation === ImportOperation.Uploading
            || (this.operation === ImportOperation.Importing && this.state !== ImportState.Successful);
    }
}
