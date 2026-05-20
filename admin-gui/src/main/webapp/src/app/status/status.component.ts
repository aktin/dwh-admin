/**
 * Created by Xu on 31-May-17.
 */
import {Component, OnInit} from '@angular/core';
import {ImportStatus} from './import-status';
import {StatusService} from './status.service';

@Component({
    templateUrl: './status.component.html',
})
export class StatusComponent implements OnInit {
    protected status: ImportStatus;

    constructor(private _statusService: StatusService) {
    }

    ngOnInit() {
        this._statusService.getImportStatus()
            .subscribe(s => this.status = s);
    }
}