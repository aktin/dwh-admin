import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceService } from './preference.service';
import { PreferenceCategory } from './preference';

@Component({
  templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css'],
})
export class PreferencesComponent  {
    constructor (private _prefService: PreferenceService,
                 private _router: Router
    ) {}

    get preferenceCategories (): PreferenceCategory[] {
        return this._prefService.getPreferenceCategories();
    }

    get fileLocation (): string {
        return this._prefService.getFileLocation();
    }

    isAuthorized() {
        return this._prefService.checkPermission()
    }

    navigateToEditPage(): void {
        this._router.navigate(['/preferencesEdit'])
    }

}
