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
    rejected: boolean;
    submitted: boolean;
    fillBar: string;
    numberItems = 7;
    itemsInStatusBar: any = null;
    oldStatus: RequestStatus;
    statusTexts = [
        'Anfrage eingegangen',
        'Anfrage prüfen',
        'Ausführung geplant',
        'Anfrage wird ausgeführt',
        'Ergebnisse freigeben',
        'Übermittlung der Ergebnisse',
        'Übermittlung abgeschlossen',
        'Fehlgeschlagen',
        'Anfrage abgelehnt',
        'Anfrage geschlossen'
    ];

    calcView () {
        if (this.request && this.oldStatus !== this.request.status) {
            this.oldStatus = this.request.status;
            this.itemsInStatusBar = Array(this.numberItems).fill({})
            let isStatusTerminal = this.checkRequestForTerminalStatus();
            if (isStatusTerminal) {
                this.fillBar = '100%';
                let obj = {
                    title: this.statusTexts[this.request.status],
                    active: true,
                    dot: false
                };
                obj[RequestStatus[this.request.status]] = true;
                this.itemsInStatusBar[3] = obj;
            } else {
                this.fillBar = Number(this.request.status) / (this.numberItems - 1) * 100 + '%';
                for (let n = 0; n < this.numberItems; n ++) {
                    let obj = {
                        title: this.statusTexts[n],
                        dot: true
                    };
                    if ( <RequestStatus> n < this.request.status ) {
                        obj['visited'] = true;
                    };
                    if ( <RequestStatus> n === this.request.status ) {
                        obj['active'] = true;
                        switch ( <RequestStatus> n ) {
                        case RequestStatus.Retrieved:
                            obj['interaction'] = false;
                            obj.dot = true;
                            break;
                        case RequestStatus.Seen:
                        case RequestStatus.Completed:
                            obj['interaction'] = true;
                            obj.dot = false;
                            break;
                        case RequestStatus.Queued:
                        case RequestStatus.Processing:
                        case RequestStatus.Sending:
                            obj['waiting'] = true;
                            obj.dot = false;
                            break;
                        };
                    };
                    this.itemsInStatusBar[n] = obj;
                }
            }
        }
    }

    checkRequestForTerminalStatus() : boolean {
        this.failed = this.request.status === RequestStatus.Failed;
        this.expired = this.request.status === RequestStatus.Expired;
        this.submitted = this.request.status === RequestStatus.Submitted;
        this.rejected = this.request.status === RequestStatus.Rejected;
        if (this.failed || this.expired || this.submitted || this.rejected) {
            return true;
        }
        return false;
    }

    get items() {
        this.calcView();
        return this.itemsInStatusBar;
    }

    ngOnInit () {
        this.calcView();
    }        
}
