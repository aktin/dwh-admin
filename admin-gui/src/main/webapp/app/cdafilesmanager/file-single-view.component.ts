/**
 * Created by Xu on 15.05.2017.
 */
import { Component, Input }     from '@angular/core';
import { FileService } from './file.service';
import { CDAFile } from './file';

@Component({
    selector: 'file-single-view',
    templateUrl: './file-single-view.component.html',
    styleUrls: ['./file.component.css'],
})

export class FileSingleViewComponent  {
    @Input() fileData: CDAFile;
    @Input() single = false;
    downloadLoading = false;

    constructor(private _fileService: FileService) {}

    get file (): CDAFile {
        return this.fileData;
    }
}
