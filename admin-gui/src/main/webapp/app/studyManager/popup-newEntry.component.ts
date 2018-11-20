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
    showError = false;

    formdata = {
        study: '',
        ext: '',
        optInOut: Participation.OptIn,
        sic: '',
        comment: ''
    }

    valid = {
        required: true,
        slashSep: true,
        slash: true,
        separator: true,
        point: true
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

    get extValid() {
        return Object.keys(this.valid).every(key => this.valid[key]);
    }

    validate() {
        Object.keys(this.valid).forEach(k => this.valid[k] = true);
        if (this.formdata.ext === '') {
            this.valid.required = false;
        }
        // max one slash as separator
        if (this.prefs['separator'] === '/' && this.prefs['root'] === '' && (this.formdata.ext.match(/\//g) || []).length > 1) {
            this.valid.slashSep = false;
        }
        // no slash allowed
        if ((this.prefs['separator'] !== '/' || this.prefs['root'] !== '') && this.formdata.ext.includes('/')) {
            this.valid.slash = false;
        }
        // separator not as first char
        if (this.prefs['root'] === '' && this.formdata.ext.slice(0, 1) === this.prefs['separator']) {
            this.valid.separator = false;
        }
        // value of root and extension may not be . or ..
        if (this.prefs['root'].length === 0) {
            let root, ext = '';
            if (this.formdata.ext.includes(this.prefs['separator'])) {
                let splits = this.formdata.ext.split(this.prefs['separator']);
                root = splits[0];
                ext = this.formdata.ext.slice(this.formdata.ext.indexOf(this.prefs['separator']) + 1);
            } else {
                root = this.formdata.ext;
                ext = '';
            }
            if (ext === '.' || ext === '..' || root === '.' || root === '..') {
                this.valid.point = false;
            }
        }
        if (this.extValid) {
            this.msgOk();
        }
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
                    let splits = ext.split(this.prefs['separator']);
                    root = splits[0];
                    ext = ext.slice(ext.indexOf(this.prefs['separator']) + 1);
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
        this.formdata.sic = '';
        Object.keys(this.valid).forEach(k => this.valid[k] = true);
    }
}
