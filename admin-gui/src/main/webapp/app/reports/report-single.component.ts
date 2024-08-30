
import {map} from 'rxjs/operators';
/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Report } from './report';
import { ReportService } from './report.service';
import Timer = NodeJS.Timer;
@Component({
    templateUrl: './report-single.component.html',
})
export class ReportSingleComponent implements OnInit, OnDestroy {
    rep: Report;
    repId: number;

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor(
        private _route: ActivatedRoute,
        private _reportService: ReportService
    ) {}

    ngOnInit(): void {
        this._route.params.pipe(
            map((params: Params) => {
            this.repId = +params['id'];
                return this._reportService.getReport(+params['id']);
            })).subscribe(
                rep => {
                    this.rep = rep;
                }
            );
    }

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimer);
    }


    updateReport (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer - report ' + this.repId);
        clearTimeout(this._updateTimer);
        this._updateTimerToggle = true;
        this._updateTimer = setTimeout(() => {
            this._updateTimerToggle = false;
            this.updateReport ();
        }, this._dataInterval);
        this.rep = this._reportService.getReport(this.repId);
    }


    get report (): Report {
        if (!this.rep) {
            this.rep = this._reportService.getReport(this.repId);
        }
        this.updateReport ();
        return this.rep;
    }
}
