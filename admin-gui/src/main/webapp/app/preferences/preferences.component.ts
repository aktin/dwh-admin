import { Component } from '@angular/core';
import { PreferenceService } from './preference.service';
import { PrefCategory } from './preference';

@Component({
  templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css'],
})
export class PreferencesComponent  {
    constructor (private prefService: PreferenceService) {}

    get prefCats (): PrefCategory[] {
        console.log( this.prefService.getPrefCats());
        return this.prefService.getPrefCats();
    }

    get fileLocation (): string {
        return this.prefService.getFileLocation();
    }
}
