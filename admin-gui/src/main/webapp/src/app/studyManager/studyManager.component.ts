import {map} from 'rxjs/operators';

import {Component, forwardRef, ViewChild} from '@angular/core';

import {Entry, Participation, PopUpDetailComponent, PopUpNewEntryComponent, Study, StudyManagerService} from './index';
import {PopUpMessageComponent} from '../helpers';
import {IMyOptions} from "gramli-angular-mydatepicker";


@Component({
    templateUrl: './studyManager.component.html',
    styleUrls: ['./studyManager.component.css'],
})

export class StudyManagerComponent {

    @ViewChild(forwardRef(() => PopUpNewEntryComponent))
    popUpNew: PopUpNewEntryComponent;
    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpMessage: PopUpMessageComponent;
    @ViewChild(forwardRef(() => PopUpDetailComponent))
    popUpDetail: PopUpDetailComponent;

    p: number; // page number
    today = new Date();
    DPOptions: IMyOptions;
    studies: Study[] = [];
    entries: Entry[] = []; // includes all entries for the selected study
    filteredEntries: Entry[] = []; // includes the entries that will be shown in the table (filtered and unfiltered)
    selectedEntry: Entry;
    filterActive = false;
    reverse = true; // sort order ascending/descending
    sortAttribute = 'timestamp';
    sorted = false;

    // filter attributes (including selection of study)
    filterdata = {
        date : {date: ''},
        study : '',
        optIn : false,
        optOut: false,
        sic: ''
    };

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

    constructor( private _managerService: StudyManagerService) {}

    ngOnInit(): void {
        this.DPOptions = this.defaultDPOptions;
        this.setStudies();
    }

    /**
     * Transforms a date object to the format which is needed by the datepicker.
     * @param d the date object that will be transformed
     * @returns the given date in the format that is requested by the datepicker
     */
    private formulateDate4DP (d: Date): any {
        return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    }

    /**
     * Transforms the given object to the corresponding date object.
     * @param s the object in datepicker format that should be transformed
     * @returns date object
     */
    private DP2date (s: any): Date {
        return new Date(s.year, s.month - 1, s.day);
    }

    getFilterdata() {
        return this.filterdata;
    }

    get study() {
        let sm = this;
        let selected = this.studies.filter(function(s) {
            return s.id === sm.filterdata.study;
        });
        if (selected.length > 0) {
            return selected[0];
        } else {
            return null;
        }
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
        return this._managerService.getEntries(this.filterdata.study).pipe(
            map(res => {
                this.p = 1;
                this.entries = res;
                this.filteredEntries = this.entries;
                if (this.filterActive) {
                    this.filterEntries();
                }
            }));
    }

    resetFilter() {
        this.setEntries(false).subscribe();
        this.filterdata.optIn = false;
        this.filterdata.optOut = false;
        this.filterdata.date = null;
    }

    /**
     * Filters all entries on the attributes of filterdata.
     */
    filterEntries() {
        let sm = this;
        this.filterActive = true;
        this.filteredEntries = this.entries.filter(function(e: Entry) {
            let fullfilled = true;
            // filter date
            if (fullfilled && sm.filterdata.date !== null && sm.filterdata.date.date !== '') {
                let filterDate = sm.DP2date(sm.filterdata.date.date);
                let date = new Date(e.timestamp);
                fullfilled = fullfilled && sm.equalsDate(date, filterDate);
            }
            // filter participation
            if (fullfilled && (sm.filterdata.optIn || sm.filterdata.optOut)) {
                fullfilled = fullfilled && ((e.participation === Participation.OptIn && sm.filterdata.optIn) ||
                                            (e.participation === Participation.OptOut && sm.filterdata.optOut));
            }
            return fullfilled;
        });
    }

    /**
     * Sets the sort attribut that allows the sorting of table columns.
     * Toggles the descending/ascending order if the attribute stays the same.
     */
    setSortAttribute(attr: string) {
        if (this.sortAttribute === attr) {
            this.reverse = !this.reverse;
        }
        this.sortAttribute = attr;
    }

    getSortAttribute() {
        if (this.reverse) {
            return '-' + this.sortAttribute;
        } else {
            return '+' + this.sortAttribute;
        }
    }

    /**
     * Creates a new entry (if the user is authorized) based on the user input.
     * If the entry already exists the entry cannot be created and the user will be informed.
     */
    createEntry() {
        if (this.isAuthorized('WRITE_STUDYMANAGER')) {
            this.popUpNew.setData((submit: boolean, id: string, ref: string, root: string, ext: string,
                                opt: Participation, sic: string, comment: string) => {
                if (submit) {
                    // create entry
                    this._managerService.createEntry(id, ref, root, ext, opt, sic, comment)
                        .subscribe(() => {
                            this.setEntries(this.filterActive).subscribe(() => {
                                this.popUpNew.clear();
                                let created = this.entries.filter(function(e: Entry) {
                                    return e.study['id'] === id && e.reference === ref && e.root === root && e.ext === ext;
                                })[0];
                                // show the detail dialog of the newly created entry
                                this.showEntry(created, true);
                            });
                        },
                            error => {
                                // entry already exists
                                if (error.split('-')[0].trim() === '409') {
                                    let pat = JSON.parse(error.split('Conflict')[1].trim());
                                    this.popUpMessage.onTop = true;
                                    let msg = 'Der Eintrag konnte nicht erstellt werden, weil für die ausgewählte Studie ' +
                                    'bereits ein Eintrag mit dieser ' + this.popUpNew.extLabel + ' existiert.';
                                    if (pat.sic) {
                                        msg += '\n\nSIC des bereits bestehenden Eintrags: ' + pat.sic + '';
                                    }
                                    this.popUpMessage.setData(true, 'Fehler beim Erstellen', msg);
                                    this.setEntries(this.filterActive).subscribe();
                                }
                        });
                }
            });
        }
    }

    /**
     * Deletes the given entry. If the entry does not exists anymore on the server an error will be shown.
     * @param entry the entry object that should be deleted
     */
    deleteEntry(entry: any) {
        this._managerService.deleteEntry(entry.study['id'], entry.reference,
            entry.root, entry.ext)
            .subscribe(() => {
                this.popUpMessage.setData(true, 'Eintrag gelöscht', 'Der Eintrag wurde erfolgreich gelöscht!');
            },
                error => {
                    if (error.split('-')[0].trim() === '400') {
                        this.popUpMessage.setData(true, 'Fehler beim Löschen',
                        'Der Eintrag konnte nicht gelöscht werden, da kein passender Datensatz hierfür gefunden werden konnte.');
                    }
            }, () => {
                    this.setEntries(this.filterActive).subscribe();
                });
    }

    /**
     * Shows the detail dialog (which includes deleting option) of the given entry.
     * @param entry the entry whose details will be shown
     * @param isNew whether the entry is newly created
     */
    showEntry(entry: any, isNew: boolean) {
        this.selectedEntry = entry;
        this.popUpDetail.isNew = isNew; // show 'successfully created' message if the entry is new
        this.popUpDetail.setData((submitDelete: boolean) => {
            if (submitDelete) {
                let buttons = ['trash icon', 'Löschen', 'red'];
                this.popUpMessage.setConfirm(buttons);
                this.popUpMessage.onTop = true; // set the delete dialog in front of the detail dialog
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

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._managerService.checkPermission(permission);
    }

    /**
     * Compares to date objects.
     * @param d1 first date object
     * @param d2 second date object
     * @returns true if the date objects describe the same day, month and year; false otherwise
     */
    equalsDate(d1: Date, d2: Date) {
        return  d1.getDate() === d2.getDate() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getFullYear() === d2.getFullYear();
    }
}
