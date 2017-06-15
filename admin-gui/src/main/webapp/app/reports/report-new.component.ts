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

    private date2String (d: Date): string {
        return d.toISOString().split('T')[0];
    }
    private string2date (s: string): Date {
        return new Date(s + 'T00:00:00');
    }
    constructor(private _reportService: ReportService, private _router: Router) {
        let date = new Date();
        date.setDate(1);
        this.toDate = this.date2String(date);
        date.setMonth(date.getMonth() - 1);
        this.fromDate = this.date2String(date);
    }


    get templates(): ReportTemplate[] {
        if (this._reportService.getDefaultTemplate()) {
            this.template = this._reportService.getDefaultTemplate().id;
        }
        return this._reportService.getReportTemplates();
    }

    generateReport(): void {
        let from = this.string2date(this.fromDate);
        let to =  this.string2date(this.toDate);
        if (from >= to) {
            this.popUp.setData(true, 'Fehler beim Erzeugen des neuen Berichts',
                    'Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!');
            to.setMonth(from.getMonth() + 1);
            this.toDate = this.date2String(to);
            return;
        }
        this._reportService.newReport(this.template, from, to);
        this.popUp.setData(true, 'Neuer Bericht',
                    'Neuer ' + this.template + ' wird erzeugt und im Übersicht angezeigt.',
                    () => {this._router.navigate(['/report'])} );
    }

    get maxFromDate(): string {
        let today = new Date();
        let max = this.toDate;
        today.setHours(0);

        if (today > this.string2date(this.toDate)) {
            max = this.date2String(today);
        }
        return max;
    }

    get minToDate(): string {
        let today = new Date();
        let min = this.fromDate;
        today.setHours(0);

        if (today < this.string2date(this.fromDate)) {
            min = this.date2String(today);
        }
        return min;
    }
}
