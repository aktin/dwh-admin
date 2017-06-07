/**
 * Created by Xu on 02-Jun-17.
 */
import { AfterContentInit, Component } from '@angular/core';

import { Report, ReportTemplate } from './report';
import { ReportService } from './report.service';
import $ = require('jquery');
require('semantic-ui');

@Component({
    templateUrl: './report-new.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportNewComponent {
    template: string;
    fromDate: string;
    toDate: string;

    constructor(private _reportService: ReportService) {
        let date = new Date();
        date.setDate(1);
        this.toDate = date.toISOString().split('T')[0]; // 2017-05-01
        /*this.toDate = date.getFullYear() + '-' + this.padStart((date.getMonth() + 1).toString(), 2, '0')
                                            + '-' + this.padStart(date.getDate().toString(), 2, '0');*/
        date.setMonth(date.getMonth() - 1);
        this.fromDate = date.toISOString().split('T')[0];
        /*this.fromDate = date.getFullYear() + '-' + this.padStart((date.getMonth() + 1).toString(), 2, '0')
                                            + '-' + this.padStart(date.getDate().toString(), 2, '0');*/
    }

    padStart (str: string, length: number, pad: string): string {
        let curLength = str.length;
        let res = str;
        for (let i = curLength; i < length; i ++) {
            res = pad + res;
        }
        return res;
    }

    get templates(): ReportTemplate[] {
        // console.log(this._reportService.getReportTemplates());
        if (this._reportService.getDefaultTemplate()) {
            this.template = this._reportService.getDefaultTemplate().id;
        }
        return this._reportService.getReportTemplates();
    }

    generateReport(): void {
        this._reportService.newReport(this.template, new Date(this.fromDate + 'T00:00:00'), new Date(this.toDate + 'T00:00:00'));
        console.log('generate')
    }
}
