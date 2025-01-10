import { Component } from '@angular/core';
import { PreferenceService } from '../preferences/preference.service';
import { PreferenceCategory } from "../preferences/preference";
import {HttpInterceptorService, UrlService} from '../helpers/index';

@Component({
    selector: 'prefEditSelector', // Custom HTML tag for the component
    templateUrl: './preferencesEdit.component.html',
    styleUrls: ['./preferencesEdit.component.css'],

})
export class PreferencesEditComponent {
    title = 'Konfigurationen Anpassen';
    constructor (
        private _prefService: PreferenceService,
        private _http: HttpInterceptorService,
        private _urls: UrlService
    ) {}

    get preferenceCategories (): PreferenceCategory[] {
        return this._prefService.getPreferenceCategories();
    }

    checkInput(key: string) {
        this._http.post(this._urls.parse('sendPreference'), {}).subscribe(response => {
            console.log('Operation success:', response.json());
        });
    }
}
