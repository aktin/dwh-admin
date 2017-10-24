/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IMyDateModel, IMyDpOptions } from 'mydatepicker';

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

    from:  Date;
    to: Date;

    fromDate: string;
    toDate: string;

    fromDateModel: any = { date: this.formulateDate4DP(new Date()) };
    toDateModel: any = { date: this.formulateDate4DP(new Date()) };

    fromDPOptions: IMyDpOptions;
    toDPOptions: IMyDpOptions;

    defaultDPOptions: IMyDpOptions = {
        dayLabels: {su: 'So', mo: 'Mo', tu: 'Di', we: 'Mi', th: 'Do', fr: 'Fr', sa: 'Sa'},
        monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mär', 4: 'Apr', 5: 'Mai', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez' },
        showTodayBtn: false,
        editableDateField: false,
        inline: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd. mmm yyyy',
        disableSince: this.formulateDate4DP(new Date()),
    };

    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }

    private date2String (d: Date): string {
        return d.toISOString().split('T')[0];
    }
    private string2date (s: string): Date {
        return new Date(s + 'T00:00:00');
    }

    constructor(private _reportService: ReportService, private _router: Router) {
        let date = new Date();
        let to = new Date();

        date.setDate(1);
        to.setDate(date.getDate() - 1);
        this.toDate = this.date2String(to);
        this.toDateModel.date = this.formulateDate4DP(to);
        this.to = to;

        date.setMonth(date.getMonth() - 1);
        this.fromDate = this.date2String(date);
        this.fromDateModel.date = this.formulateDate4DP(date);
        this.from = date;

        this.fromDPOptions = this.defaultDPOptions;
        this.toDPOptions = this.defaultDPOptions;

        // this.toDPOptions.disableUntil = this.formulateDate4DP(date);
    }

    onFromDateChanged(event: IMyDateModel) {
        this.fromDateModel.date = event.date;
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

    onToDateChanged(event: IMyDateModel) {
        this.toDateModel.date = event.date;
    }

    get templates(): ReportTemplate[] {
        if (this._reportService.getDefaultTemplate()) {
            this.template = this._reportService.getDefaultTemplate().id;
        }
        return this._reportService.getReportTemplates();
    }

    generateReport(): void {
        // let from = this.string2date(this.fromDate);
        // let to =  this.string2date(this.toDate);
        let from = this.DP2date(this.fromDateModel.date);
        let to = this.DP2date(this.toDateModel.date);

        to.setDate(to.getDate() + 1);
        if (from >= to) {
            this.popUp.setData(true, 'Fehler beim Erzeugen des neuen Berichts',
                    'Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!');
            to.setMonth(from.getMonth() + 1);
            to.setDate(to.getDate() - 1);
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

    get maxToDate(): string {
        return this.date2String(new Date());
    }
}
