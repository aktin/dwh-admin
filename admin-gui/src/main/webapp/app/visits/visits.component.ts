import { Component, OnDestroy } from '@angular/core';

import { Visit } from './visit';
import { VisitService } from './visit.service';
import Timer = NodeJS.Timer;

@Component({
    templateUrl: './visits.component.html',
    styleUrls: ['./visits.component.css'],
})
export class VisitsComponent implements OnDestroy{
    root: string = '1.2.276.0.76.3.87686';
    encounterId: string = '20171050';
    _visitData: Visit = null;
    waiting = false;

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor (private _fileService: VisitService) {}

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimer);
    }


    updateVisit (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer - visit');
        clearTimeout(this._updateTimer);
        this._updateTimerToggle = true;
        this._updateTimer = setTimeout(() => {
            this._updateTimerToggle = false;
            this.updateVisit ();
        }, this._dataInterval);
        this._visitData = this._fileService.getVisit(this.root, this.encounterId);
    }

    search (): void {
        console.log(this.root, this.encounterId);
        this.waiting = true;
        this._visitData = this._fileService.getVisit(this.root, this.encounterId);
    }

    get visit () {
        if (this._visitData) {
            console.log(this._visitData.root, this._visitData.encounterId);
        }
        this.updateVisit ();
        return this._visitData;
    }
}


