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
    showOnlySuccessful: boolean = false;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    constructor (private reportService: ReportService) {}

    get reports (): Report[] {
        this.reportsData = this.reportService.getReports();
        return this.reportsData;
    }

    generateReport (): void {
        this.reportService.newReport();
        this.popUp.show = true;
    }
}


