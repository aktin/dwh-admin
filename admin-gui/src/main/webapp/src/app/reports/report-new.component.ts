/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { ReportTemplate } from './report';
import { ReportService } from './report.service';
import {IMyDateModel, IMyOptions} from "gramli-angular-mydatepicker";


@Component({
    templateUrl: './report-new.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportNewComponent {

    template: string;

    fromDateModel: IMyDateModel;
    toDateModel: IMyDateModel;

    fromDPOptions: IMyOptions;
    toDPOptions: IMyOptions;

    showErrorNotification: Boolean = false;
    errorNotificationText: string = "";

    p: number; // page number
    today = new Date();

    defaultDPOptions: IMyOptions = {
        dayLabels: {su: 'So', mo: 'Mo', tu: 'Di', we: 'Mi', th: 'Do', fr: 'Fr', sa: 'Sa'},
        monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mär', 4: 'Apr', 5: 'Mai', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez' },
        // showTodayBtn: false,
        // editableDateField: false,
        inline: false,
        // openSelectorOnInputClick: true,
        dateFormat: 'dd. mmm. yyyy',
        disableSince: {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1},
    }


    constructor(private _reportService: ReportService, private _router: Router) {
        // let date = new Date();
        // let to = new Date();
        //
        // date.setDate(1);
        // to.setDate(date.getDate() - 1);
        // this.toDateModel.date = to;
        //
        // date.setMonth(date.getMonth() - 1);
        // this.fromDateModel.date = date;

        this.fromDPOptions = this.defaultDPOptions;
        this.toDPOptions = this.defaultDPOptions;
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
            from = this.fromDateModel.singleDate.jsDate;
        } catch(e){
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Startdatum aus!"
            return
        };
        let to = null;
        try {
            to = this.toDateModel.singleDate.jsDate;
        } catch(e){
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Enddatum aus!"
            return
        };
        to.setDate(to.getDate() + 1);
        if (from >= to) {
            // to.setMonth(from.getMonth() + 1);
            // to.setDate(to.getDate() - 1);
            // this.toDateModel.date = to;
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!"
            return;
        }
        this._reportService.newReport(this.template, from, to);
        this._router.navigate(['/report']);
    }
}
