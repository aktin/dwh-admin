/**
 * Created by Xu on 02-Jun-17.
 */
import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';


import {ReportTemplate} from './report';
import {ReportService} from './report.service';
import {IMyDate, IMyDateModel, IMyOptions} from "gramli-angular-mydatepicker";
import moment from "moment";
import {MY_CALENDAR_DEFAULT_OPTIONS, MY_CALENDAR_OPTIONS} from "../helpers";


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
    errorNotificationText: string = '';

    p: number; // page number

    constructor(private _reportService: ReportService,
                private _router: Router,
                @Inject(MY_CALENDAR_OPTIONS) options: IMyOptions) {
        this.fromDPOptions = options;
        this.toDPOptions = options;
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
        } catch (e) {
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Startdatum aus!"
            return
        }
        let to = null;
        try {
            to = this.toDateModel.singleDate.jsDate;
        } catch (e) {
            this.showErrorNotification = true;
            this.errorNotificationText = "Bitte wählen Sie ein valides Enddatum aus!"
            return
        }
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
