/**
 * Created by Xu on 04.05.2017.
 */
import { Component, OnDestroy } from '@angular/core';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';

import { RequestService } from './request.service';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestsComponent implements OnDestroy {
    requestsData: LocalRequest[];
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';
    queryDetails = {};

    private _timerSubscription: Subscription;
    private _dataInterval = 5000;

    constructor(private _requestService: RequestService) {}

    ngOnInit() {
        let timer = TimerObservable.create(0, this._dataInterval);
        this._timerSubscription = timer.subscribe(() => {
            this.updateRequests();
        });
    }

    ngOnDestroy(): void {
        console.log('unsubscribe timer');
        this._timerSubscription.unsubscribe();
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

    updateRequests(): void {
        console.log('update Requests');
        this._requestService.getRequests()
            .subscribe(res => {
                this.requestsData = res;
                this.updateQueryDetails();
            });
    }

    get requests(): LocalRequest[] {
        return this.requestsData;
    }

    updateQueryDetails() {
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
    }

}
