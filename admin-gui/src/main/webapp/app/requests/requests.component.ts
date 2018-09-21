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
    etag = '0';
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

    get stateFilterArray(): [string, RequestStatus|string, any][] {
        return [
            [ 'Alle anzeigen', 'all', null ],
            [ 'Aktion erforderlich', 'auth', null ],
            [ 'Neue Anfragen', 'new', null ],
            [ 'Einzelanfragen', 'single', null ],
            [ 'Serien-Anfragen', 'recurring', null ],
            [ 'Gelöschte Anfragen', 'hidden',  null ],
            [ 'Laufende Anfragen' , null,
                [
                [ 'Alle laufenden Anfragen', 'inProgress' ],
                [ 'Eingegangen (neue Anfragen)', 'retrieved' ],
                [ 'Freigabe der Abfrage', 'seen' ],
                [ 'Ausführung geplant', 'queued' ],
                [ 'Ausführung läuft', 'processing' ],
                [ 'Freigabe der Ergebnisse', 'completed' ],
                ]
            ],
            [ 'Abgeschlossene Anfragen' , null,
                [
                [ 'Alle abgeschlossenen Anfragen', 'done' ],
                [ 'Übermittlung abgeschlossen', 'submitted' ],
                [ 'Abgelehnt', 'rejected' ],
                [ 'Fehlgeschlagen', 'failed' ],
                [ 'Geschlossen', 'expired' ]
                ]
            ]
        ];
    }

    updateRequests(): void {
        this._requestService.getRequests(this.etag)
            .subscribe(res => {
                console.log('update Requests');
                this.requestsData = res['req'];
                this.etag = res['etag'];
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
                    if (+new Date(req1.query.reference) === +new Date(req2.query.reference)) {
                        return req1.requestId - req2.requestId;
                    } else {
                        return +new Date(req1.query.reference) - +new Date(req2.query.reference);
                    }
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
