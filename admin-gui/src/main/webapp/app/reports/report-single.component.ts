/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Report } from './report';
import { ReportService } from './report.service';
@Component({
    templateUrl: './report-single.component.html',
})
export class ReportSingleComponent implements OnInit {
    report: Report;

    constructor(
        private _route: ActivatedRoute,
        private _reportService: ReportService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
                return this._reportService.getReport(+params['id'] - 1);
            }).subscribe(
                rep => {
                    this.report = rep;
                }
            );
    }
}
