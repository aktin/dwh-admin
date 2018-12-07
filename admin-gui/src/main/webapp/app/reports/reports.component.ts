import { Component, OnDestroy } from '@angular/core';

import { Report } from './report';
import { ReportService } from './report.service';
import Timer = NodeJS.Timer;

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnDestroy {
    reportsData: Report[];
    showOnlySuccessful = false;

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor (private _reportService: ReportService) {}

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimer);
    }


    updateReport (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer - reports');
        clearTimeout(this._updateTimer);
        this._updateTimerToggle = true;
        this._updateTimer = setTimeout(() => {
            this._updateTimerToggle = false;
            this.updateReport ();
        }, this._dataInterval);
        this.reportsData = this._reportService.getReports();
    }

    get reports (): Report[] {
        this.updateReport ();
        this.reportsData = this._reportService.getReports();
        return this.reportsData;
    }

    isAuthorized(permission: string) {
        return this._reportService.checkPermission(permission);
    }

}


