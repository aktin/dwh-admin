/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PopUpMessageComponent } from '../helpers/index';
import { ReportTemplate } from './report';
import { ReportService } from './report.service';

import $ = require('jquery');
require('semantic-ui');

@Component({
    templateUrl: './report-new.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportNewComponent {
    template: string;
    fromDate: string;
    toDate: string;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    constructor(private _reportService: ReportService, private _router: Router) {
        let date = new Date();
        date.setDate(1);
        this.toDate = date.toISOString().split('T')[0];
        date.setMonth(date.getMonth() - 1);
        this.fromDate = date.toISOString().split('T')[0];
    }


    get templates(): ReportTemplate[] {
        if (this._reportService.getDefaultTemplate()) {
            this.template = this._reportService.getDefaultTemplate().id;
        }
        return this._reportService.getReportTemplates();
    }

    generateReport(): void {
        let from = new Date(this.fromDate + 'T00:00:00');
        let to =  new Date(this.toDate + 'T00:00:00');
        if (from >= to) {
            this.popUp.setData(true, 'Fehler beim Erzeugen des neuen Berichts',
                    'Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!');
            to.setMonth(from.getMonth() + 1);
            this.toDate = to.toISOString().split('T')[0];
            return;
        }
        this._reportService.newReport(this.template, from, to);
        this.popUp.setData(true, 'Neuer Bericht',
                    'Neuer ' + this.template + ' wird erzeugt und im Übersicht angezeigt.',
                    () => {this._router.navigate(['/report'])} );
    }
}
