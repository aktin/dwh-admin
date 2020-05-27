import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {State, UrlService} from "@aktin/utils";
import {select, Store} from "@ngrx/store";

import { IMyDpOptions } from 'mydatepicker';
import {ReportService} from "../../services";
import {getReportTemplatesAsArray, TemplateUpdate} from "../../store";
import {Observable} from "rxjs";
import {ReportTemplate} from "../../models";
import {tap} from "rxjs/operators";

@Component({
    selector: 'admin-gui-report-new',
    templateUrl: "./report-new.component.html",
    styleUrls: ["../../main.css"],
})
export class ReportNewComponent implements OnInit {
    reportTemplates$: Observable<ReportTemplate[]>;

    template: string;
    fromDateModel: any = { date: this.formulateDate4DP(new Date()) };
    toDateModel: any = { date: this.formulateDate4DP(new Date()) };
    fromDPOptions:  IMyDpOptions;
    toDPOptions:  IMyDpOptions;

    defaultDPOptions:  IMyDpOptions = {
        dayLabels: this.s.getValue("datepicker.weekdayLabels"),
        monthLabels: this.s.getValue("datepicker.monthLabels"),
        showTodayBtn: false,
        editableDateField: false,
        inline: false,
        openSelectorOnInputClick: true,
        dateFormat: this.s.getValue("datepicker.dateFormat"),
        disableSince: this.formulateDate4DP(new Date()),
    };

    constructor(
        private _route: ActivatedRoute,
        private _url: UrlService,
        private _store: Store<State>,
        private s: ReportService,
    ) {
        let date = new Date();
        let to = new Date();

        date.setDate(1);
        to.setDate(date.getDate() - 1);

        this.toDateModel.date = this.formulateDate4DP(to);

        date.setMonth(date.getMonth() - 1);
        this.fromDateModel.date = this.formulateDate4DP(date);

        this.fromDPOptions = this.defaultDPOptions;
        this.toDPOptions = this.defaultDPOptions;




    }
    
    ngOnInit() {

        this._store.dispatch(new TemplateUpdate());
        this.reportTemplates$ = this._store.pipe(select(getReportTemplatesAsArray));
    }

    generateReport () {
        console.log("generating report");
    }

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }
    
}
