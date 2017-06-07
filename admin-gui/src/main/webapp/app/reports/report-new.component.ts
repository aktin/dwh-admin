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
export class ReportNewComponent implements AfterContentInit {
    template: string;
    fromDate: Date;
    toDate: Date;

    constructor(private _reportService: ReportService) {}

    ngAfterContentInit () {
        // console.log('befor dropdown init');
        // let dropDown = $('.template-select.ui.dropdown');
        // if (dropDown[0] && dropDown[0].localName === 'select') {
        //     // first time init
        //     dropDown.dropdown({
        //         allowAdditions: true,
        //         fullTextSearch: true,
        //         // onChange: function (value, text, $choice){console.log(value, text, $choice)}
        //     });
        //     console.log('dropdown init');
        // }
        // console.log('after dropdown init');
    }

    get templates(): ReportTemplate[] {
        return this._reportService.getReportTemplates();
    }

    showDateRangePicker(): void {
        $('.daterangepicker').addClass('display-calendar');
    }

    generateReport(): void {
        console.log('generate')
    }
}
