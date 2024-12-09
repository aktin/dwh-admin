import { Component } from '@angular/core';
import { PreferenceService } from '../preferences/preference.service';
import {PreferenceCategory} from "../preferences/preference";

@Component({
    selector: 'prefEditSelector', // Custom HTML tag for the component
    templateUrl: './preferencesEdit.component.html',
    styleUrls: ['./preferencesEdit.component.css'],

})
export class PreferencesEditComponent {
    // Component logic goes here
    title = 'Konfigurationen Anpassen';
    constructor (private _prefService: PreferenceService) {}

    get preferenceCategories (): PreferenceCategory[] {
        // console.log( this._prefService.getPreferenceCategories());
        return this._prefService.getPreferenceCategories();
    }

}
