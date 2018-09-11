import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';

import { Report } from './report';
import { ReportService } from './report.service';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnDestroy {
    reportsData: Report[];
    showOnlySuccessful = false;
    repEtag = '0';

    private _dataInterval = 5000;
    private _timerSubscription: Subscription;

    constructor (private _reportService: ReportService) {}

    ngOnInit() {
        let timer = TimerObservable.create(0, this._dataInterval);
        this._timerSubscription = timer.subscribe(() => {
            this.updateReports();
        });
    }

    ngOnDestroy() {
        console.log('unsubscribe timer');
        this._timerSubscription.unsubscribe();
    }

    updateReports() {
        this._reportService.getReports(this.repEtag)
            .subscribe(res => {
                console.log('update reports');
                this.reportsData = res['reports'];
                this.repEtag = res['etag'];
            })
    }

    get reports (): Report[] {
        return this.reportsData;
    }

}


