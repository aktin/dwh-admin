/**
 * Created by Xu on 15.05.2017.
 */
import { Component, Input }     from '@angular/core';
import { Report, ReportStatus } from './report';
import { ReportService } from './report.service';

@Component({
    selector: 'report-single-view',
    templateUrl: './report-single-view.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportSingleViewComponent  {
    @Input() reportData: Report;
    @Input() single = false;
    downloadLoading = false;

    constructor(private _reportService: ReportService) {}

    get report (): Report {
        return this.reportData;
    }

    get reportClass () {
        return {
            'report-waiting'    : this.report.status === ReportStatus.Waiting,
            'report-success'    : this.report.status === ReportStatus.Completed,
            'report-failed'     : this.report.status !== ReportStatus.Completed,
        };
    }

    downloadResult (): void {
        console.log(this.reportData);
        this.downloadLoading = true;
        this._reportService.downloadReportFile(this.reportData);
        setTimeout(() => {
            this.downloadLoading = false;
        }, 500);
    }
}
