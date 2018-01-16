/**
 * Created by Xu on 04.05.2017.
 */
import { Component, OnDestroy } from '@angular/core';

import { RequestService } from './request.service';
import { LocalRequest, RequestMarker, RequestStatus } from './request';
import Timer = NodeJS.Timer;

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnDestroy{
    requestsData: LocalRequest[];
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor(private _requestService: RequestService) { }

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimer);
    }

    get stateFilterArray(): [string, RequestStatus|string][] {
        return [
            [ 'Alle anzeigen', 'all' ],
            [ 'Aktion erforderlich', 'auth' ],
            [ 'Neue Anfragen', 'new' ],
            [ 'Gelöschte Anfragen', 'hidden' ],
        ];
    }

    updateRequest (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer');
        clearTimeout(this._updateTimer);
        this._updateTimerToggle = true;
        this._updateTimer = setTimeout(() => {
            this._updateTimerToggle = false;
            this.updateRequest ();
        }, this._dataInterval);
        this.requestsData = this._requestService.getRequests();
    }

    get requests(): LocalRequest[] {
        this.updateRequest ();
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
    }
}
