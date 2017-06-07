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
        date.setHours(2);
        this.toDate = date.toISOString().split('T')[0];
        /*this.toDate = date.getFullYear() + '-' + this.padStart((date.getMonth() + 1).toString(), 2, '0')
                                            + '-' + this.padStart(date.getDate().toString(), 2, '0');*/
        date.setMonth(date.getMonth() - 1);
        this.fromDate = date.toISOString().split('T')[0];
        /*this.fromDate = date.getFullYear() + '-' + this.padStart((date.getMonth() + 1).toString(), 2, '0')
                                            + '-' + this.padStart(date.getDate().toString(), 2, '0');*/
        this.template = this._reportService.getDefaultTemplate().id;
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
        return this._reportService.getReportTemplates();
    }

    generateReport(): void {
        console.log(this.template, this.fromDate, this.toDate, new Date(this.fromDate), new Date(this.toDate));
        this._reportService.newReport(this.template, new Date(this.fromDate), new Date(this.toDate));
        console.log('generate')
    }
}
