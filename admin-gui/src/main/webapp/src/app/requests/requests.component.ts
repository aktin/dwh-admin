/**
 * Created by Xu on 04.05.2017.
 */
import {Component, OnInit} from '@angular/core';

import {RequestService} from './request.service';
import {LocalRequest, RequestStatus} from './request';
import {race, Subject, switchMap, takeUntil, timer} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestsComponent implements OnInit {
    p: number;
    requestsData: LocalRequest[];
    etag = '0';
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';
    queryDetails = {};
    timeoutBool = false;

    private _dataInterval = 5000;
    private _dataTimeout = 30000;
    private _foundRequests$: Subject<void> = new Subject<void>();

    constructor(private _requestService: RequestService) {}

    ngOnInit() {
        // get requests every {this._dataInterval} ms until either {this._dateTimeout} runs out or getRequests returns a non-empty array
        timer(0, this._dataInterval)
            .pipe(switchMap(() => this._requestService.getRequests(this.etag)),
                takeUntil(race(timer(this._dataTimeout), this._foundRequests$)),
                finalize(() => this.timeoutBool = true),)
            .subscribe(res => {
                this.requestsData = res['req'];
                this.etag = res['etag'];

                this.updateQueryDetails();

                if(!!this.requestsData?.length) {
                    this._foundRequests$.next();
                }
            });
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
            [ 'Archivierte Anfragen', 'hidden',  null ],
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

    get requests(): LocalRequest[] {
        return this.requestsData;
    }

    /**
    * Returns the position of the request inside the belonging series (ordered by reference date).
    * @returns position of request in the belonging series
    */
    getNumRequest(request: LocalRequest): number {
        return this.queryDetails[request.queryId].order.indexOf(request.requestId) + 1;
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
