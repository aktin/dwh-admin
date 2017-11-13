/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CDAFile } from './file';
import { FileService } from './file.service';
@Component({
    templateUrl: './file-single.component.html',
})
export class FileSingleComponent implements OnInit {
    file: CDAFile;
    patId: number;

    constructor(
        private _route: ActivatedRoute,
        private _fileService: FileService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
            this.patId = +params['id'];
                return this._fileService.getCDAFile(+params['id']);
            }).subscribe(
                file => {
                    this.file = file;
                }
            );
    }

    get cdaFile (): CDAFile {
        if (!this.file) {
            this.file = this._fileService.getCDAFile(this.patId);
        }
        return this.file;
    }
}
