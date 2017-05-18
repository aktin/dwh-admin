import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { ReportService } from './report.service';
import { Report } from './report';
/**
 * Created by Xu on 15.05.2017.
 */
@Component({
    templateUrl: './report-single.component.html',
})
export class ReportSingleComponent implements OnInit{
    report: Report;

    constructor(
        private route: ActivatedRoute,
        private reportService: ReportService
    ) {}

    ngOnInit(): void {
        this.route.params
            .map((params: Params) => {
                return this.reportService.getReport(+params['id'] - 1);
            }).subscribe(
                rep => {
                    this.report = rep;
                }
            );
    }
}
