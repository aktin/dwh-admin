import { Component } from '@angular/core';

import { Report } from './report';
import { ReportService } from './report.service';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
    reportsData: Report[];
    showOnlySuccessful = false;

    constructor (private _reportService: ReportService) {}

    get reports (): Report[] {
        this.reportsData = this._reportService.getReports();
        return this.reportsData;
    }
}


