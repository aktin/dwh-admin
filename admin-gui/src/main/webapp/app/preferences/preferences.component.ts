import { Component } from '@angular/core';
import { PreferenceService } from './preference.service';

@Component({
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent  {
    aktinPrefernceFile = '';

    constructor (private prefService: PreferenceService) {}

    get prefs (): string {
        this.prefService.updateProperties();
        return 'prefs';
    }
}
