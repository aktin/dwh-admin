import { Component } from '@angular/core';
import { PreferenceService } from './preference.service';
import { PreferenceCategory } from './preference';

@Component({
  templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css'],
})
export class PreferencesComponent  {
    constructor (private _prefService: PreferenceService) {}

    get preferenceCategories (): PreferenceCategory[] {
        // console.log( this._prefService.getPreferenceCategories());
        return this._prefService.getPreferenceCategories();
    }

    get fileLocation (): string {
        return this._prefService.getFileLocation();
    }
}
