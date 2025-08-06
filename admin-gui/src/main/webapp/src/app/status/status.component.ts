/**
 * Created by Xu on 31-May-17.
 */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ImportStatus } from './import-status';
import { StatusService } from './status.service';

@Component({
    templateUrl: './status.component.html',
})
export class StatusComponent implements OnInit {
    status$: Observable<ImportStatus>;

    constructor(private _statusService: StatusService) {}

    ngOnInit(): void {
        this.status$ = this._statusService.status$;
        this._statusService.fetchStatus(); // ✅ manually trigger fetch
    }
}
