/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild, OnInit } from '@angular/core';
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

    template: ReportTemplate;
    templateList: ReportTemplate[];

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

    ngOnInit() {
        this.getTemplates();
    }

    getTemplates() {
        this._reportService.getReportTemplates()
            .subscribe(resp => {
                this.templateList = resp;
                if (this.templateList.length > 0) {
                    this.template = this.templateList[0];
                }
            });
    }

    onFromDateChanged(event: IMyDateModel) {
        this.fromDateModel.date = event.date;
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

    onToDateChanged(event: IMyDateModel) {
        this.toDateModel.date = event.date;
    }

    get templates(): ReportTemplate[] {
        return this.templateList;
    }

    get templateId(): string {
        if (this.template) {
            return this.template.id;
        }
        return null;
    }

    generateReport(): void {
        let to, from;
        if (this.fromDateModel && this.toDateModel) {
            from = this.DP2date(this.fromDateModel.date);
            to = this.DP2date(this.toDateModel.date);
            to.setDate(to.getDate() + 1);
        }
        if (from >= to || !from || !to) {
            this.popUp.setData(true, 'Fehler beim Erzeugen des neuen Berichts',
                    'Bitte wählen Sie eine passende Zeitspanne von mindestens einem Tag aus!');
            // to.setMonth(from.getMonth() + 1);
            // to.setDate(to.getDate() - 1);
            // this.toDateModel.date = this.formulateDate4DP(to);
            return;
        }
        this._reportService.newReport(this.template.id, from, to);
        this.popUp.setData(true, 'Neuer Bericht wird erstellt',
        'Der Bericht "' + this.template.description + '" wird erstellt und steht danach in der Berichtsübersicht bereit.',
                    () => {this._router.navigate(['/report'])} );
    }
}
