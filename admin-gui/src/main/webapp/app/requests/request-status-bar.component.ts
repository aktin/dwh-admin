/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input, OnInit } from '@angular/core';
import { LocalRequest, RequestStatus } from './request';

import _ = require('underscore');

@Component({
    selector: 'request-status-bar',
    templateUrl: './request-status-bar.component.html',
    styleUrls: ['./request-status-bar.component.css'],
})

export class RequestStatusBarComponent implements OnInit {
    @Input() request: LocalRequest;
    @Input() single: boolean;
    @Input() interaction: boolean;
    @Input() queryDetails: object;
    failed: boolean;
    expired: boolean;
    fillBar: string;
    leftSpace: string;
    statusLength = 7;
    myItems: any = null;
    oldStatus: RequestStatus;
    statusTexts = [
        'Eingegangen',
        'Freigabe der Abfrage',
        'Ausführung geplant',
        'Ausführung läuft',
        'Freigabe der Ergebnisse', // Abfrageergebnis berechnet
        'Senden der Ergebnisse',
        'Übermittlung abgeschlossen',
        'Fehlgeschlagen',
        'Abgelehnt',
        'Geschlossen'
    ];

    calcView () {
        if (this.request && this.oldStatus !== this.request.status) {
            this.oldStatus = this.request.status;
            this.failed = this.request.failed();
            this.expired = this.request.status === RequestStatus.Expired;
            this.myItems = [];
            if (this.failed || this.expired) {
                this.fillBar = '100%';
                this.leftSpace = 'calc((100% - 20px)';
                this.myItems.push({});
                let obj = {
                    title: this.statusTexts[this.request.status],
                    active: true,
                    dot: false
                };
                obj[RequestStatus[this.request.status]] = true;
                this.myItems.push(obj);
            } else {
                this.fillBar = Number(this.request.status) / (this.statusLength - 1) * 100 + '%';
                this.leftSpace = 'calc((100% - ' + (this.statusLength * 10) + 'px) / ' + (this.statusLength - 1) + ')';
                for (let n = 0; n < this.statusLength; n ++) {
                    let obj = {
                        title: this.statusTexts[n],
                        dot: true
                    };
                    if ( <RequestStatus> n < this.request.status ) {
                        obj['visited'] = true;
                    }
                    if ( <RequestStatus> n === this.request.status ) {
                        obj['active'] = true;
                        if (this.request.needAuthorization()) {
                            obj.dot = false;
                            obj['interaction'] = true;
                        }
                    }
                    if (this.request.status === RequestStatus.Submitted && n === this.statusLength - 1) {
                        obj[RequestStatus[this.request.status]] = true;
                        obj.dot = false;
                    }
                    this.myItems.push(obj);
                }
            }
        }
    }

    get items() {
        this.calcView();
        return this.myItems;
    }

    /**
     * Returns the position of the request inside the belonging series (ordered by reference date).
     * @returns position of request in the belonging series
     */
    getNumRequest(request: LocalRequest): number {
        return this.queryDetails[request.queryId].order.indexOf(request.requestId) + 1;
    }

    ngOnInit () {
        this.calcView();
    }
}
