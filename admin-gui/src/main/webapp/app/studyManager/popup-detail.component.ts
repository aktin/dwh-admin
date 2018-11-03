import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { StudyManagerService } from './index';

@Component({
    selector: 'popup-detail',
    templateUrl: './popup-detail.component.html',
    styleUrls : ['./../helpers/popup-message.component.css'],
})
export class PopUpDetailComponent implements OnInit {

    callback: Function;
    buttons = [['Eintrag löschen', 'red'], ['Zurück', 'orange']];
    head = 'Details';
    show = false;
    prefs: object;

    @Input() entry: any = {};

    constructor( private _managerService: StudyManagerService ) {}

    ngOnInit() {
      this.setPreferences();
    }

    isAuthorized(permission: string) {
        return this._managerService.checkPermission(permission);
    }

    get extLabel(): String {
        let label: String;
        switch (this.entry.reference) {
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
            this.callback(true);
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
    }
}
