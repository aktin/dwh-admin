/**
 * Created by Xu on 02-Jun-17.
 */
import { Component } from '@angular/core';

import { Report, ReportTemplate } from './report';
import { ReportService } from './report.service';
import $ = require('jquery');
require('semantic-ui');
require('daterangepicker');
@Component({
    templateUrl: './report-new.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportNewComponent {
    template: string;

    constructor(private _reportService: ReportService) {}

    get templates(): ReportTemplate[] {
        let dropDown = $('.template-select.ui.dropdown');
        if (dropDown[0] && dropDown[0].localName === 'select') {
            // first time init
            dropDown.dropdown({
                allowAdditions: true,
                fullTextSearch: true,
                // onChange: function (value, text, $choice){console.log(value, text, $choice)}
            });
            console.log('dropdown init');
        }
        console.log('after dropdown init');

        return this._reportService.getReportTemplates();
    }

    showDateRangePicker(): void {
        $('.daterangepicker').addClass('display-calendar');
    }

    generateReport(): void {
        console.log('generate')
    }
}
