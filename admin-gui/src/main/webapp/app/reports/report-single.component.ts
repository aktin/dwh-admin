/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';

import { Report } from './report';
import { ReportService } from './report.service';
import Timer = NodeJS.Timer;
@Component({
    templateUrl: './report-single.component.html',
})
export class ReportSingleComponent implements OnInit, OnDestroy {
    rep: Report;
    repId: number;
    repEtag: '0';

    private _dataInterval = 5000;
    private _timerSubscription: Subscription;
    private _paramsSubscription: Subscription;

    constructor(
        private _route: ActivatedRoute,
        private _reportService: ReportService
    ) {}

    ngOnInit(): void {
        this._route.params
            .subscribe((params: Params) => {
                this.repId = +params['id'];
            })
        let timer = TimerObservable.create(0, this._dataInterval);
        this._timerSubscription = timer.subscribe(() => {
            if (this.repId) {
                this.updateReport();
            }
        });
    }

    ngOnDestroy(): void {
        console.log('unsubscribe timer');
        this._timerSubscription.unsubscribe();
    }

    updateReport() {
        this._reportService.getReport(this.repId, this.repEtag)
            .subscribe(res => {
                console.log('update report');
                this.rep = res['report'];
                this.repEtag = res['etag'];
            })
    }

    get report (): Report {
        return this.rep;
    }
}
