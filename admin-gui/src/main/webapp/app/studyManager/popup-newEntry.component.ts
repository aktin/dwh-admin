import { Component, Input, ViewChild, OnInit, ElementRef } from '@angular/core';

import { StudyManagerService } from './index';

@Component({
    selector: 'popup-newEntry',
    templateUrl: './popup-newEntry.component.html',
    styleUrls : ['./popup-newEntry.component.css'],
})
export class PopUpNewEntryComponent implements OnInit {
    static OPT_IN = 'OptIn';
    static OPT_OUT = 'OptOut';
    // @Input() callback: Function;
    callback: Function;
    @Input() studies: any;
    buttons = [['Speichern', 'green'], ['Abbrechen', 'orange']];
    head = 'Neuen Eintrag erstellen';
    message = 'Bitte füllen Sie die folgenden Felder aus, um einen neuen Eintrag zu erstellen.';
    show = false;
    prefs: object;


    formdata = {
        studyId: '',
        ext: '',
        optInOut: PopUpNewEntryComponent.OPT_IN,
        comment: ''
    }

    constructor( private _managerService: StudyManagerService) {}

    ngOnInit() {
       this.setStudyPreferences();
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

    setStudyPreferences() {
        this._managerService.getStudyPreferences()
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
            this.callback(true, this.formdata.studyId, this.formdata.ext, this.formdata.optInOut, this.formdata.comment);
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
        this.formdata.studyId = '';
        this.formdata.ext = '';
        this.formdata.optInOut = this.optInString;
        this.formdata.comment = '';
    }
}
