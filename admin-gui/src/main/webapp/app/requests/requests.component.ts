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

export class RequestsComponent implements OnDestroy {
    requestsData: LocalRequest[];
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';
    queryDetails = {};

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor(private _requestService: RequestService) {}

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
            [ 'Wiederkehrende Anfragen', 'recurring' ],
            [ 'Abgeschlossene Anfragen', 'done' ],
            [ 'Erfolgreiche Anfragen', 'submitted' ],
            [ 'Fehlgeschlagene Anfragen', 'failed' ],
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
        this.queryDetails = {};
    }

    get requests(): LocalRequest[] {
        this.updateRequest ();
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
    }

    getQueryDetails(): object {
        for (let i = 0; i < this.requestsData.length; i++) {
            let currReq = this.requestsData[i];
            if (currReq.isRecurring() && !this.queryDetails.hasOwnProperty(currReq.queryId)) {
                let query = this.requestsData.filter(function(req) {
                    return req.queryId === currReq.queryId;
                });
                query.sort((req1: LocalRequest, req2: LocalRequest) => {
                    return +new Date(req1.query.reference) - +new Date(req2.query.reference);
                });
                let order: number[] = [];
                query.forEach(request => {
                    order.push(request.requestId);
                });
                let rejected = query.filter(
                    req => req.status === RequestStatus.Rejected).length;
                let accepted = query.filter(
                    req => req.status !== RequestStatus.Retrieved &&  req.status !== RequestStatus.Seen
                        &&  req.status !== RequestStatus.Rejected).length;
                let submitted = query.filter(
                    req => req.status === RequestStatus.Submitted).length;
                this.queryDetails[currReq.queryId] = { 'order': order, 'rejected': rejected, 'accepted': accepted, 'submitted': submitted };
            }
        }
        return this.queryDetails;
    }
}
