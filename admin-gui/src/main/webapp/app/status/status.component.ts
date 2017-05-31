/**
 * Created by Xu on 31-May-17.
 */
import { Component } from '@angular/core';
import { ImportStatus } from './import-status';
import { StatusService } from './status.service';

@Component({
    templateUrl: './status.component.html',
})
export class StatusComponent  {
    constructor (private _statusService: StatusService) {}

    get status (): ImportStatus {
        return this._statusService.getImportStatus();
    }
}
