import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { StudyManagerService } from './index';

@Component({
    selector: 'popup-newEntry',
    templateUrl: './popup-newEntry.component.html',
    styleUrls : ['./popup-newEntry.component.css'],
})
export class PopUpNewEntryComponent implements OnInit {
    static OPT_IN = 'OptIn';
    static OPT_OUT = 'OptOut';

    callback: Function;
    buttons = [['Speichern', 'green'], ['Abbrechen', 'orange']];
    head = 'Neuen Eintrag erstellen';
    message = 'Bitte füllen Sie die folgenden Felder aus, um einen neuen Eintrag zu erstellen.';
    show = false;
    prefs: object;
    study: any;

    formdata = {
        study: '',
        ext: '',
        optInOut: PopUpNewEntryComponent.OPT_IN,
        comment: ''
    }

    @Input() studies: any;
    @Input() set selectedStudy(value: any) {
        this.formdata.study = value;
        this.setStudy();
     }

    constructor( private _managerService: StudyManagerService ) {}

    ngOnInit() {
       this.setPreferences();
    }

    setStudy() {
        let popup = this;
        this.study = this.studies.filter(function(s: any) {
            return s.id === popup.formdata.study;
        });
        if (this.study.length > 0) {
            this.study = this.study[0];
            if (this.study.supportsOptIn) {
                this.formdata.optInOut = PopUpNewEntryComponent.OPT_IN;
            } else if (this.study.supportsOptOut) {
                this.formdata.optInOut = PopUpNewEntryComponent.OPT_OUT;
            }
        }
    }

    get optInString() {
        return PopUpNewEntryComponent.OPT_IN;
    }
    get optOutString() {
        return PopUpNewEntryComponent.OPT_OUT;
    }

    get extLabel(): String {
        let label: String;
        switch (this.prefs['reference']) {
            case 'Patient':
                label = this.prefs['labelPatient'];
                break;
            case 'Encounter':
                label = this.prefs['labelEncounter'];
                break;
            case 'Billing':
                label = this.prefs['labelBilling'];
                break;
        }
        if (label === '') {
            this._managerService.redirect2Home();
            throw new Error('No label in aktin.properties file set for the selected reference.');
        }
        return label;
    }

    get optIn(): boolean {
        if (this.study.hasOwnProperty('supportsOptIn')) {
            return this.study.supportsOptIn;
        }
        return true;
    }

    get optOut(): boolean {
        if (this.study.hasOwnProperty('supportsOptOut')) {
            return this.study.supportsOptOut;
        }
        return true;
    }

    get manualSic(): boolean {
        if (this.study.hasOwnProperty('supportsManualSic')) {
            return this.study.supportsManualSic;
        }
        return true;
    }

    setPreferences() {
        this._managerService.getPreferences()
            .subscribe(res => { this.prefs = res; });
    }

    setData (callback?: Function): void {
        this.show = true;
        this.callback = callback;
    }

    closeMessage (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.clear();
    }

    msgOk (): void {
        this.show = false;
        if (this.callback) {
            this.callback(true, this.formdata.study, this.formdata.ext, this.formdata.optInOut, this.formdata.comment);
        }
        this.clear();
    }

    msgCancel (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.clear();
    }

    clear (): void {
        this.callback = null;
        this.show = false;
        // this.formdata.study = '';
        this.formdata.ext = '';
        this.formdata.comment = '';
    }
}
