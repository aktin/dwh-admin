import { AfterViewInit, Component, ElementRef, forwardRef, Renderer2, ViewChild } from '@angular/core';
import { PreferenceService } from '../preferences/preference.service';
import { Preference, PreferenceCategory } from "../preferences/preference";
import {HttpInterceptorService, UrlService} from '../helpers/index';
import { PreferenceEditService } from "./preferencesEdit.service";
import { LoadingComponent } from "../helpers/loading.component";
import { Router } from "@angular/router";


@Component({
    selector: 'prefEditSelector',
    templateUrl: './preferencesEdit.component.html',
    styleUrls: ['./preferencesEdit.component.css'],
})
export class PreferencesEditComponent implements AfterViewInit {
    title = 'Konfigurationen Anpassen';
    bottombanner = "bottombanner";
    pref_input_class = "preferenceValue";
    @ViewChild(forwardRef(() => LoadingComponent))
    loadingComponent: LoadingComponent;


    constructor (
        private _prefService: PreferenceService,
        private _service: PreferenceEditService,
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _document: ElementRef,
        private _renderer: Renderer2,
        private _router: Router
    ) {}
    ngAfterViewInit(): void {}

    /**
     * Finds an input element by its `id` attribute and updates its class attribute.
     * If no element is found, a log message is created
     * @param id
     */
    markInputAsInvalid(id: String): void {
        const inputElement = this._document.nativeElement.querySelector(`[id="${id}"]`);
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
        this.createBanner()
    }

    processChanges(changeType: String) {
        this.hideBanner()
        if (changeType==="apply") {
            let prefs_json = this._service.scrapPreferenceTable(this._document, this.pref_input_class);
            this._service.setCookie('AKTIN.showPrefUpdate', 'true');
            window.location.href = "/aktin/admin/plain/update.html";
            this._http.post(this._urls.parse('sendPreference'), prefs_json).subscribe(response => {
                    console.log(response)
            }
            , error => {
                console.log(error)
            }
            );

        } else if (changeType==="revert") {
            this.navigateToPreferencePage()
        }
    }

    createBanner() {
        let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
        if (banner) {
            this.unhideBanner()
        } else {
            console.error('Element with id: \"' + this.bottombanner + '\" not found');
        }
    }

    hideBanner() {
        let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
        if (banner) {
            this._renderer.setAttribute(banner, 'hidden', '');
        }
    }

    unhideBanner() {
        let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
        if (banner) {
            this._renderer.removeAttribute(banner, 'hidden')
        }
    }

    navigateToPreferencePage(): void {
        this._service.navigateToPreferencePage()
    }

}
