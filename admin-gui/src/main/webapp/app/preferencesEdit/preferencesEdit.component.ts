import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import { PreferenceService } from '../preferences/preference.service';
import { Preference, PreferenceCategory } from "../preferences/preference";
import { HttpInterceptorService, UrlService } from '../helpers/index';


@Component({
    selector: 'prefEditSelector',
    templateUrl: './preferencesEdit.component.html',
    styleUrls: ['./preferencesEdit.component.css'],
})
export class PreferencesEditComponent implements AfterViewInit {
    title = 'Konfigurationen Anpassen';
    constructor (
        private _prefService: PreferenceService,
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _dom: ElementRef,
        private _renderer: Renderer2
    ) {}
    ngAfterViewInit(): void {}

    /**
     * Finds an input element by its `id` attribute and updates its class attribute.
     * If no element is found, a log message is created
     * @param id
     */
    markInputAsInvalid(id: String): void {
        const inputElement = this._dom.nativeElement.querySelector(`[id="${id}"]`);
        if (inputElement) {
            console.log('Found input:', inputElement);
            this._renderer.setProperty(inputElement, 'className', 'preferenceValue invalid-input');
        } else {
            console.log(`Element with id "${id}" not found.`);
        }
    }

    get preferenceCategories (): PreferenceCategory[] {
        return this._prefService.getPreferenceCategories();
    }

    /**
     *
     * @param pref
     */
    checkInput(pref: Preference) {
        let key = pref.key
        let value = pref.value
        this._http.post(this._urls.parse('sendPreference'), {"key": key, "value": value}).subscribe(response => {
            let json = response.json()
            if (json == false) {
                this.markInputAsInvalid(pref.key)
            }
        });
    }
}
