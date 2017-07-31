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
    failed: boolean;
    fillBar: string;
    leftSpace: string;

    statusLength = 7;

    items: any = null;

    statusTexts = [
        'Eingegangen',
        'Freigabe der Abfrage',
        'Ausführung geplant',
        'Ausführung läuft',
        'Freigabe der Ergebnisse', // Abfrageergebnis berechnet
        'Senden der Ergebnisse',
        'Übermittlung abgeschlossen',
        'Fehlgeschlagen',
        'Abgelehnt'
    ];

    ngOnInit () {
        if (this.request && this.items === null) {
            this.failed = this.request.failed();
            this.items = [];
            if (this.failed) {
                this.fillBar = '100%';
                this.leftSpace = 'calc((100% - 20px)';
                this.items.push({});
                let obj = {
                    title: this.statusTexts[this.request.status],
                    active: true,
                    dot : false
                };
                obj[RequestStatus[this.request.status]] = true;
                this.items.push(obj);
            } else {
                this.fillBar = Number(this.request.status) / (this.statusLength - 1) * 100 + '%';
                this.leftSpace = 'calc((100% - ' + (this.statusLength * 10) + 'px) / ' + (this.statusLength - 1) + ')';
                for (let n = 0; n < this.statusLength; n ++) {
                    let obj = {
                        title: this.statusTexts[n],
                        dot : true
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
                    this.items.push(obj);
                }
            }
        }
    }
}