import {Component, OnDestroy, OnInit} from '@angular/core';

import {Visit} from './visit';
import {VisitService} from './visit.service';
import Timeout = NodeJS.Timeout;
import {IMyDateModel, IMyOptions} from "gramli-angular-mydatepicker";

@Component({
    templateUrl: './visits.component.html',
    styleUrls: ['./visits.component.css'],
})

export class VisitsComponent implements OnInit, OnDestroy {
    root: string = '1.2.276.0.76.3.87686';
    encounterId: string = '20171050';

    _visitData: Visit = null;
    waiting = false;
    visitOption = 'optionPatient';
    formdata = {
        patientId : '',
        patientRoot : '',
        patientEncounterId : '',
        casenumber : '',
        caseRoot : '',
        caseEncounterId : '',
        startDate : { date: this.formulateDate4DP(new Date()) },
        startTime : '',
        endDate : { date: {} },
        endTime : '',
    };

    today = new Date();
    visitStart: Date;
    visitEnd: Date;
    startDPOptions: IMyOptions;
    endDPOptions: IMyOptions;

    startDateRequired = false;
    endDateRequired = false;

    private _updateTimeout: Timeout;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    defaultDPOptions: IMyOptions = {
        dayLabels: {su: 'So', mo: 'Mo', tu: 'Di', we: 'Mi', th: 'Do', fr: 'Fr', sa: 'Sa'},
        monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mär', 4: 'Apr', 5: 'Mai', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez' },
        // showTodayBtn: false,
        // editableDateField: false,
        inline: false,
        // openSelectorOnInputClick: true,
        dateFormat: 'dd. mmm. yyyy',
        disableSince: {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1},
    }

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }

    constructor (private _fileService: VisitService) {}

    ngOnInit(): void {
        this.formdata.endDate = null;
        this.startDPOptions = this.defaultDPOptions;
        this.endDPOptions = this.defaultDPOptions;
    }

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimeout);
    }

    onStartDateChanged(event: IMyDateModel) {
        this.formdata.startDate = this.formdata.startDate || {date: {year: 0 , month: 0, day: 0}};
        this.formdata.startDate.date = event.singleDate;
    }

    onEndDateChanged(event: IMyDateModel) {
        if (!this.formdata.endDate || this.formdata.endDate.hasOwnProperty('date')) {
            this.formdata.endDate = {date: {year: 0 , month: 0, day: 0}};
        }
        this.formdata.endDate.date = event.singleDate
    }

    parseDates() {
        if (this.formdata.startTime === '') {
            this.visitStart = new Date(this.DP2date(this.formdata.startDate.date));
        } else {
            let hours = Number(this.formdata.startTime.split(':')[0]);
            let minutes = Number(this.formdata.startTime.split(':')[1]);
            this.visitStart = new Date(this.DP2date(this.formdata.startDate.date));
            this.visitStart.setHours(hours, minutes);
        }
        // @ts-ignore
        if (this.formdata.endDate !== null && this.formdata.endDate !== {date: {year: 0 , month: 0, day: 0}}) {
            this.visitEnd = new Date(this.DP2date(this.formdata.endDate.date));
            if (this.formdata.endTime !== '') {
                let hours = Number(this.formdata.endTime.split(':')[0]);
                let minutes = Number(this.formdata.endTime.split(':')[1]);
                this.visitEnd.setHours(hours, minutes);
            } else {
                this.visitEnd.setHours(23, 59);
            }
        }
    }

    updateVisit (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer - visit');
        clearTimeout(this._updateTimeout);
        this._updateTimerToggle = true;
        this._updateTimeout = setTimeout(() => {
            this._updateTimerToggle = false;
            this.updateVisit ();
        }, this._dataInterval);
        // this._visitData = this._fileService.getVisit(this.root, this.encounterId);
    }

    // not working correctly, DP bubble: ui pointing red basic label?
    isValid(): boolean {
        let comp = this;
        if (this.visitOption === 'optionDate' && !this.formdata.startDate ||
            // @ts-ignore
            this.formdata.startDate === {date: {year: 0 , month: 0, day: 0}} || !new Date(this.formdata.startDate.date)) {
            this.startDateRequired = true;
            setTimeout(function(){ comp.startDateRequired = false; }, 5000);
            return false;
        }
        if (this.visitOption === 'optionDate' && this.formdata.endTime !== '' && (!this.formdata.endDate ||
            // @ts-ignore
            this.formdata.endDate === {date: {year: 0 , month: 0, day: 0}})) {
            this.endDateRequired = true;
            setTimeout(function(){ comp.endDateRequired = false; }, 5000);
            return false;
        }
        return true;
    }

    search (): void {
        let submit = this.isValid();
        if (submit) {
            this.parseDates();
            // console.log(this.root, this.encounterId);
            // this.root = this.formdata['root'];
            // this.encounterId = this.formdata['encounterId'];
            this.waiting = true;
            this._visitData = this._fileService.getVisit(this.root, this.encounterId);
        }
    }


    get visit () {
        if (this._visitData) {
            console.log(this._visitData.root, this._visitData.encounterId);
        }
        this.updateVisit();
        return this._visitData;
    }
}


