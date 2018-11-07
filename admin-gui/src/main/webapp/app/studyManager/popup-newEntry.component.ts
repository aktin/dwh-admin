import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { StudyManagerService, Study, Participation } from './index';

@Component({
    selector: 'popup-newEntry',
    templateUrl: './popup-newEntry.component.html',
    styleUrls : ['./popup-newEntry.component.css', './../helpers/popup-message.component.css'],
})
export class PopUpNewEntryComponent implements OnInit {

    callback: Function;
    buttons = [['Speichern', 'green'], ['Abbrechen', 'orange']];
    head = 'Neuen Eintrag erstellen';
    message = 'Bitte füllen Sie die folgenden Felder aus, um einen neuen Eintrag zu erstellen.';
    show = false;
    prefs: object;
    study: Study;

    formdata = {
        study: '',
        ext: '',
        optInOut: Participation.OptIn,
        sic: '',
        comment: ''
    }

    @Input() studies: Study[];
    @Input() set selectedStudy(value: string) {
        this.formdata.study = value;
        this.setStudy();
     }

    constructor( private _managerService: StudyManagerService ) {}

    ngOnInit() {
       this.setPreferences();
    }

    setStudy() {
        let popup = this;
        this.study = this.studies.filter(function(s: Study) {
            return s.id === popup.formdata.study;
        })[0];
        if (this.study) {
            if (this.study.supportsOptIn) {
                this.formdata.optInOut = Participation.OptIn;
            } else if (this.study.supportsOptOut) {
                this.formdata.optInOut = Participation.OptOut;
            }
        }
    }

    get participationOptIn() {
        return Participation.OptIn;
    }

    get participationOptOut() {
        return Participation.OptOut;
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
        return this.study.supportsOptIn;
    }

    get optOut(): boolean {
        return this.study.supportsOptOut;
    }

    get manualSic(): boolean {
        return this.study.supportsManualSic;
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
        if (this.callback) {
            let root = this.prefs['root'];
            let ext = this.formdata.ext;
            let sic = this.formdata.sic;
            if (sic.length > 0 && this.formdata.optInOut === Participation.OptOut) {
                sic = '';
            }
            if (root.length === 0) {
                if (ext.includes(this.prefs['separator'])) {
                    let splits = ext.split(this.prefs['separator'], 2);
                    root = splits[0];
                    ext = splits[1];
                } else {
                    root = ext;
                    ext = '';
                }
            }
            this.callback(true, this.formdata.study, this.prefs['reference'], root, ext,
                this.formdata.optInOut, sic, this.formdata.comment);
        }
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
        this.formdata.ext = '';
        this.formdata.comment = '';
    }
}
