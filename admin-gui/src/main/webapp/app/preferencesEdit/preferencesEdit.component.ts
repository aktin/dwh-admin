import { Component } from '@angular/core';
import { PreferenceService } from '../preferences/preference.service';
import { PreferenceCategory } from "../preferences/preference";
import {HttpInterceptorService, UrlService} from "../helpers";

@Component({
    selector: 'prefEditSelector', // Custom HTML tag for the component
    templateUrl: './preferencesEdit.component.html',
    styleUrls: ['./preferencesEdit.component.css'],

})
export class PreferencesEditComponent {
    // Component logic goes here
    title = 'Konfigurationen Anpassen';
    constructor (
        private _prefService: PreferenceService,
        private _http: HttpInterceptorService,
        private _urls: UrlService
    ) {}

    get preferenceCategories (): PreferenceCategory[] {
        // console.log( this._prefService.getPreferenceCategories());
        return this._prefService.getPreferenceCategories();
    }

    onInputBlur(key: string) {
        const data = { key };

        // let response = this._http.post('/aktin/admin/rest/update/updateProperties',
        //     this._http.generateHeaderOptions('Content-Type', 'text/plain'))
        //     .catch(err => { return this._http.handleError(err) }).subscribe();
        // console.log(response);

        // let response = this._http.post(this._urls.parse('sendPreference'),
        //     this._http.generateHeaderOptions('Content-Type', 'application/json'))
        //     .catch(err => { return this._http.handleError(err) }).subscribe();
        // console.log(response);
    }
}
