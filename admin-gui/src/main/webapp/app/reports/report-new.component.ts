/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IMyDateModel, IMyDpOptions } from 'mydatepicker';

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

    fromDateModel: any = { date: this.formulateDate4DP(new Date()) };
    toDateModel: any = { date: this.formulateDate4DP(new Date()) };

    fromDPOptions: IMyDpOptions;
    toDPOptions: IMyDpOptions;

    showErrorNotification: Boolean = false;
    errorNotificationText: string = "";

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

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }


    constructor(private _reportService: ReportService, private _router: Router) {
        let date = new Date();
        let to = new Date();

        date.setDate(1);
        to.setDate(date.getDate() - 1);
        this.toDateModel.date = this.formulateDate4DP(to);

        date.setMonth(date.getMonth() - 1);
        this.fromDateModel.date = this.formulateDate4DP(date);

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

    getDescription(): String {
        let comp = this;
        let temp = this._reportService.getReportTemplates().filter(t => {
            return t.id === comp.template;
        });
        if (temp.length > 0) {
            return temp[0].description;
        }
        return this.template;
    }

    generateReport(): void {
        let from = null;
        try {
            from = this.DP2date(this.fromDateModel.date);
        } catch(e){
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Startdatum aus!"
            return
        };
        let to = null;
        try {
            to = this.DP2date(this.toDateModel.date);
        } catch(e){
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Enddatum aus!"
            return
        };
        to.setDate(to.getDate() + 1);
        if (from >= to) {
            to.setMonth(from.getMonth() + 1);
            to.setDate(to.getDate() - 1);
            this.toDateModel.date = this.formulateDate4DP(to);
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!"
            return;
        }
        this._reportService.newReport(this.template, from, to);
        this._router.navigate(['/report']);
    }
}
