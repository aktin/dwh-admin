import { Component } from '@angular/core';
import { PreferenceService } from './preference.service';

@Component({
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent  {
    constructor (private propertyService: PreferenceService) {}

    get prefs (): string {
        this.propertyService.updateProperties();
        return 'prefs';
    }
}
