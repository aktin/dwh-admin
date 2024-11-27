/**
 * Created by Xu on 04.05.2017.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';

import {RequestService} from './request.service';
import {LocalRequest, RequestStatus} from './request';

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestsComponent implements OnInit, OnDestroy {
    p: number;
    requestsData: LocalRequest[];
    etag = '0';
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';
    queryDetails: any = {};
    timeoutBool = false;

    private _timerSubscription: Subscription;
    private _dataInterval = 5000;
    private _dataTimeout = 30000;

    constructor(private _requestService: RequestService) {}

    ngOnInit() {
        let timer$ = timer(0, this._dataInterval);
        this._timerSubscription = timer$.subscribe(() => {
            this.updateRequests();
        });
        setTimeout(() => {
            console.log('unsubscribe timer due to timeout');
            this._timerSubscription.unsubscribe();
            this.timeoutBool=true;
        }, this._dataTimeout);
    }

    ngOnDestroy(): void {
        console.log('unsubscribe timer');
        this._timerSubscription.unsubscribe();
    }

    /**
     * Returns requests filter.
     * @returns array of arrays which have the following values: the shown text, the belonging state
     * and substates of the same form (or null if no substates are available)
     */
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

    /**
     * Updates the list of requests and the belonging etag.
     */
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

    /**
     * Updates the query details of every series by calculating all values new using the requests of the belonging query bundle as base.
     */
    updateQueryDetails() {
        for (let i = 0; i < this.requestsData.length; i++) {
            let currReq = this.requestsData[i];
            if (currReq.isRecurring()) {
                let query = this.requestsData.filter(function(req) {
                    return req.queryId === currReq.queryId;
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
