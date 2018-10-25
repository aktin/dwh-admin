
import { Component, Input, ViewChild, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { StudyManagerService, PopUpNewEntryComponent } from './index';
import { PopUpMessageComponent } from './../helpers/popup-message.component';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';

import $ = require('jquery');
require('semantic-ui-tablesort');

@Component({
    templateUrl: './studyManager.component.html',
    styleUrls: ['./studyManager.component.css'],
})

export class StudyManagerComponent {
    static OPT_IN = 'OptIn';
    static OPT_OUT = 'OptOut';

    @ViewChild(forwardRef(() => PopUpNewEntryComponent))
    popUp: PopUpNewEntryComponent;
    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpMessage: PopUpMessageComponent;

    etag = '0';
    today = new Date();
    DPOptions: IMyDpOptions;
    studies: any = [];
    entries: any = [];
    filteredEntries: any = [];
    selectedEntries: any = [];
    filterActive = false;

    filterdata = {
        date : { date: this.formulateDate4DP(this.today) },
        study : '',
        optIn : false,
        optOut: false,
    };

    defaultDPOptions: IMyDpOptions = {
        dayLabels: {su: 'So', mo: 'Mo', tu: 'Di', we: 'Mi', th: 'Do', fr: 'Fr', sa: 'Sa'},
        monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mär', 4: 'Apr', 5: 'Mai', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez' },
        showTodayBtn: false,
        editableDateField: false,
        inline: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd. mmm. yyyy',
        disableSince: {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1},
    }

    constructor( private _managerService: StudyManagerService) {}

    ngOnInit(): void {
        this.DPOptions = this.defaultDPOptions;
        this.setStudies();
        this.setEntries(false);
        ($('.table.sortable') as any).tablesort(); // .data('tablesort').sort($('#default-sort'));
    }

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }

    getSelectedEntries() {
        let sm = this;
        this.selectedEntries = [];
        this.filteredEntries.forEach(function(e: any) {
            if (e['selected']) {
               sm.selectedEntries.push({id: e.study.id, sic: e.sic});
            }
        });
        return this.selectedEntries;
    }

    setStudies() {
        this._managerService.getStudies().subscribe(res => {
            this.studies = res;
        });
    }

    setEntries(filtered: boolean) {
        // in case the response returns status 304 (not modified)
        this.filterActive = filtered;
        this.filteredEntries = this.entries;
        if (this.filterActive) {
            this.filterEntries();
        }
        return this._managerService.getPatientList(this.etag)
            .subscribe(res => {
                this.entries = res['entries'];
                this.etag = res['etag'];
                this.entries.sort(function(a: any, b: any) {
                    return b['timestamp'] - a['timestamp'];
                });
                this.filteredEntries = this.entries;
                if (this.filterActive) {
                    this.filterEntries();
                }
            });
    }

    resetFilter() {
        this.setEntries(false);
        this.filterdata.optIn = false;
        this.filterdata.optOut = false;
        this.filterdata.study = '';
        this.filterdata.date = { date: this.formulateDate4DP(this.today) };
    }

    filterEntries() {
        let sm = this;
        this.filteredEntries = this.entries.filter(function(e: any) {
            let fullfilled = true;
            if (fullfilled && sm.filterdata.study.trim() !== '') {
                fullfilled = fullfilled && e.study.id === sm.filterdata.study;
            }
            if (fullfilled && sm.filterdata.date) {
                let filterDate = sm.DP2date(sm.filterdata.date.date);
                let date = new Date(e.timestamp);
                fullfilled = fullfilled && sm.equalsDate(date, filterDate);
            }
            if (fullfilled && (sm.filterdata.optIn || sm.filterdata.optOut)) {
                fullfilled = fullfilled && ((e.participation === StudyManagerComponent.OPT_IN && sm.filterdata.optIn) ||
                                            (e.participation === StudyManagerComponent.OPT_OUT && sm.filterdata.optOut));
            }
            return fullfilled;
        });
    }

    createEntry() {
        if (this.isAuthorized('WRITE_STUDY_MANAGER')) {
            this.popUp.setData((submit: boolean, studyId: String, ext: String, optInOut: String, comment: String) => {
                if (submit) {
                    this._managerService.createEntry(studyId, ext, optInOut, null, comment)
                        .subscribe(() => { this.setEntries(this.filterActive); },
                            error => {
                                if (error.split('-')[0].trim() === '500') {
                                    this.popUpMessage.setData(true, 'Fehler beim Erstellen',
                                    'Der Eintrag könnte nicht erstellt werden, weil für die ausgewählte Studie ' +
                                    'bereits ein Eintrag mit dieser ' + this.popUp.extLabel + ' existiert.');
                                }
                        });
                }
            });
        }
    }

    deleteEntry() {
        if (this.getSelectedEntries().length > 0 && this.isAuthorized('WRITE_STUDY_MANAGER')) {
            let sm = this;
            let selected = this.getSelectedEntries();
            let num = selected.length;
            let buttons = [['Löschen', 'green'], ['Abbrechen', 'orange']];
            this.popUpMessage.setConfirm(buttons);
            this.popUpMessage.setData(true, 'Eintrag löschen',
                'Sie haben ' + (num === 1 ? 'einen Eintrag' : num + ' Einträge') + ' zum Löschen ausgewählt.' +
                ' Wollen Sie ' + (num === 1 ? 'diesen' : 'diese') + ' wirklich unwiderruflich löschen?',
                (submitDelete: boolean) => {
                    if (submitDelete) {
                        selected.forEach(function(e: any) {
                            sm._managerService.deleteEntry(e.id, e.sic).subscribe();
                            sm.filteredEntries.splice(sm.filteredEntries.findIndex((el: any) =>
                                el.study.id === e.id && el.sic === e.sic ), 1);
                        });
                    }
                }
            );
        }
    }

    isAuthorized(permission: string) {
        return this._managerService.checkPermission(permission);
    }

    equalsDate(d1: Date, d2: Date) {
        return  d1.getDate() === d2.getDate() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getFullYear() === d2.getFullYear();
    }
}
