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
    rep: Report;
    repId: number;

    constructor(
        private _route: ActivatedRoute,
        private _reportService: ReportService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
            this.repId = +params['id'];
                return this._reportService.getReport(+params['id']);
            }).subscribe(
                rep => {
                    this.rep = rep;
                }
            );
    }

    get report (): Report {
        if (!this.rep) {
            this.rep = this._reportService.getReport(this.repId);
        }
        return this.rep;
    }
}
