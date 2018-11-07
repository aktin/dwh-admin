
import { Component, Input, ViewChild, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { StudyManagerService, PopUpNewEntryComponent, PopUpDetailComponent, Entry, Study, Participation } from './index';
import { PopUpMessageComponent } from './../helpers/popup-message.component';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';

import $ = require('jquery');
require('semantic-ui-tablesort');

@Component({
    templateUrl: './studyManager.component.html',
    styleUrls: ['./studyManager.component.css'],
})

export class StudyManagerComponent {

    @ViewChild(forwardRef(() => PopUpNewEntryComponent))
    popUp: PopUpNewEntryComponent;
    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpMessage: PopUpMessageComponent;
    @ViewChild(forwardRef(() => PopUpDetailComponent))
    popUpDetail: PopUpDetailComponent;

    today = new Date();
    DPOptions: IMyDpOptions;
    studies: Study[] = [];
    entries: Entry[] = [];
    filteredEntries: Entry[] = [];
    selectedEntry: Entry;
    filterActive = false;

    filterdata = {
        date : {date: ''},
        study : '',
        optIn : false,
        optOut: false,
        sic: ''
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
        ($('.table.sortable') as any).tablesort();
    }

    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }

    getFilterdata() {
        return this.filterdata;
    }

    setStudies() {
        this._managerService.getStudies().subscribe(res => {
            this.studies = res;
            if (this.studies.length > 0) {
                this.filterdata.study = this.studies[0].id;
                this.setEntries(false).subscribe();
            }
        });
    }

    setEntries(filtered: boolean) {
        this.filterActive = filtered;
        let sm = this;
        return this._managerService.getEntries(this.filterdata.study)
            .map(res => {
                this.entries = res;
                this.filteredEntries = this.entries;
                if (this.filterActive) {
                    this.filterEntries();
                }
            });
    }

    resetFilter() {
        this.setEntries(false).subscribe();
        this.filterdata.optIn = false;
        this.filterdata.optOut = false;
        this.filterdata.date = null;
    }

    filterEntries() {
        let sm = this;
        this.filteredEntries = this.entries.filter(function(e: any) {
            let fullfilled = true;
            if (fullfilled && sm.filterdata.date !== null && sm.filterdata.date.date !== '') {
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
        if (this.isAuthorized('WRITE_STUDYMANAGER')) {
            this.popUp.setData((submit: boolean, id: String, ref: String, root: String, ext: String,
                                opt: Participation, sic: String, comment: String) => {
                if (submit) {
                    this._managerService.createEntry(id, ref, root, ext, opt, sic, comment)
                        .subscribe(() => {
                            this.setEntries(this.filterActive).subscribe(() => {
                                this.popUp.clear();
                                let created = this.entries.filter(function(e: Entry) {
                                    return e.study.id === id && e.reference === ref && e.root === root && e.ext === ext;
                                })[0];
                                this.showEntry(created);
                            });
                        },
                            error => {
                                if (error.split('-')[0].trim() === '409') {
                                    this.popUpMessage.onTop = true;
                                    this.popUpMessage.setData(true, 'Fehler beim Erstellen',
                                    'Der Eintrag konnte nicht erstellt werden, weil für die ausgewählte Studie ' +
                                    'bereits ein Eintrag mit dieser ' + this.popUp.extLabel + ' existiert.');
                                }
                        });
                }
            });
        }
    }

    deleteEntry(entry: any) {
        this._managerService.deleteEntry(entry.study.id, entry.reference,
            entry.idRoot, entry.idExt)
            .finally(() => {
                this.setEntries(true).subscribe();
            })
            .subscribe(() => {
                this.popUpMessage.setData(true, 'Eintrag gelöscht', 'Der Eintrag wurde erfolgreich gelöscht!');
            },
                error => {
                    if (error.split('-')[0].trim() === '400') {
                        this.popUpMessage.setData(true, 'Fehler beim Löschen',
                        'Der Eintrag konnte nicht gelöscht werden, da kein passender Datensatz hierfür gefunden werden konnte.');
                    }
            });
    }

    showEntry(entry: any) {
        this.selectedEntry = entry;
        this.popUpDetail.setData((submitDelete: boolean) => {
            if (submitDelete) {
                let buttons = [['Löschen', 'green'], ['Abbrechen', 'orange']];
                this.popUpMessage.setConfirm(buttons);
                this.popUpMessage.onTop = true;
                this.popUpMessage.setData(true, 'Eintrag löschen',
                    ' Wollen Sie diesen Eintrag wirklich unwiderruflich löschen?',
                    (submit: boolean) => {
                        if (submit) {
                            this.deleteEntry(entry);
                            this.popUpDetail.clear();
                        }
                    }
                );
            }
        });

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
