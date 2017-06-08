import { Component, ViewChild } from '@angular/core';
import { PopUpMessageComponent } from '../helpers/index';

import { Report } from './report';
import { ReportService } from './report.service';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportsComponent  {
    reportsData: Report[];
    showOnlySuccessful = false;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    constructor (private _reportService: ReportService) {}

    get reports (): Report[] {
        this.reportsData = this._reportService.getReports();
        return this.reportsData;
    }

    generateReport (): void {
        this._reportService.newReportMonthly();
        this.popUp.show = true;
    }
}


