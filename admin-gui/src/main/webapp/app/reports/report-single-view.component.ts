/**
 * Created by Xu on 15.05.2017.
 */
import { Component, Input }     from '@angular/core';
import { Report, ReportStatus } from './report';

@Component({
    selector: 'report-single-view',
    templateUrl: './report-single-view.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportSingleViewComponent  {
    @Input() reportData: Report;
    @Input() single = false;

    constructor() {}

    get report (): Report {
        return this.reportData;
    }

    get reportClass () {
        return {
            'report-waiting'    : this.report.status === ReportStatus.Waiting,
            'report-success'    : this.report.isSuccess(),
            'report-failed'     : !this.report.isSuccess(),
        };
    }
}
