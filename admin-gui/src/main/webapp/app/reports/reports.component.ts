import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Report } from './report';
import { ReportService } from './report.service';
import { PopUpMessageComponent } from '../helpers/popup-message.component';

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


@Pipe({ name: 'successReports' })
export class SuccessReportsPipe implements PipeTransform {
    transform(reports: Report[], usefilter: boolean) {
        return usefilter ? reports.filter(report => report.isSuccess()) : reports;
    }
}
