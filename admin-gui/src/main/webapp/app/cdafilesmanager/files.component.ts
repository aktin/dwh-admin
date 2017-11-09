import { Component } from '@angular/core';

import { CDAFile } from './file';
import { FileService } from './file.service';

@Component({
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css'],
})
export class FilesComponent {
    cdaData: CDAFile[];
    showOnlySuccessful = false;

    constructor (private _fileService: FileService) {}

    get cdaFiles (): CDAFile[] {
        this.cdaData = this._fileService.getCDAFiles();
        return this.cdaData;
    }
}


