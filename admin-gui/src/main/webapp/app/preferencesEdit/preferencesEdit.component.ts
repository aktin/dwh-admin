import {AfterViewInit, Component, ElementRef, forwardRef, HostListener, Renderer2, ViewChild} from '@angular/core';
import {PreferenceService} from '../preferences/preference.service';
import {Preference, PreferenceCategory} from "../preferences/preference";
import {HttpInterceptorService, UrlService} from '../helpers/index';
import {PreferenceEditService} from "./preferencesEdit.service";
import {LoadingComponent} from '../helpers/loading.component';
import {Router} from "@angular/router";
import Timer = NodeJS.Timer;


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
    validationTimeout: Timer; // used to determine when validation will happen after change, expands when in mean time another change happened
    srollDownBtnVisible: boolean = true;       // true if button for "scrolling to end" should be displayed
    selectedAction: any;    //
    backups: String[];

    constructor (
        private _prefService: PreferenceService,
        private _service: PreferenceEditService,
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _document: ElementRef,
        private _renderer: Renderer2,
        private _router: Router,
    ) {}

    // ngOnInit(): void {
    //     //get table max x value
    //     console.log("oninit")
    //     let max_x = this._document.nativeElement.querySelector(`[id="preference-table"]`).getBoundingClientRect().right
    //     let table = this._document.nativeElement.querySelector(`[id="preference-table"]`)
    //     table.getBoundingClientRect().width
    //
    //
    //     //set scroll button position
    //     let btn = this._document.nativeElement.querySelector(`[id="scroll-down-btn"]`)
    //
    //
    //     this._renderer.setStyle(btn, "left", `${window.innerWidth/max_x}%`)
    // }

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this.updateBackupHistory();
    }

    /**
     * Returns a data object consisting of a list of {@link PreferenceCategory} objects. This data object should store all
     * currently existing property keys from the "aktin.properties" configuration file, and their respective values
     */
    get preferenceCategories(): PreferenceCategory[] {
        return this._prefService.getPreferenceCategories();
    }

    updateBackupHistory() {
        this._http.get(this._urls.parse('getBackups')).subscribe((response) => {
            try {
                this.backups = response.json()
            } catch (error) {
                console.error('Invalid JSON body:', error);
            }

        });
    }

    /**
     *
     * @param pref
     * @param newVal2
     * @param timeout
     */
    validateInput(pref: Preference, newVal2: Event, timeout: number) {
        // remove old timeout until validation
        if (this.validationTimeout) {
            clearTimeout(this.validationTimeout);
        }

        // get new input value to validate
        let newVal;
        if ((event.target as HTMLInputElement).value) {
            newVal = (event.target as HTMLInputElement).value;
        } else {
            const input = this._document.nativeElement.querySelector(`[id="${pref.key}"]`);
            this._renderer.setAttribute(input, "className", "preferenceValue invalid-input");
            return;
        }

        // set new timeout until validation
        this.validationTimeout = setTimeout(() => {
            const input = this._document.nativeElement.querySelector(`[id="${pref.key}"]`);

            if(this._service.isValid(pref.key, pref.value)) {
                this._renderer.removeAttribute(input, "className");
                this.createBanner();
            } else {
                this._renderer.setAttribute(input, "className", "preferenceValue invalid-input");
                // this.hideBanner();
            }
        }, timeout);
    }

    processChanges() {
        // this.hideBanner()
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
    }

    onActionChange(value: String) {
        console.log(value)
        this.selectedAction = value
    }

    createBanner() {
        let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
        if (banner) {
            // this.unhideBanner()
        } else {
            console.error('Element with id: \"' + this.bottombanner + '\" not found');
        }
    }

    // hideBanner() {
    //     let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
    //     if (banner) {
    //         this._renderer.setAttribute(banner, 'hidden', '');
    //     }
    // }

    // unhideBanner() {
    //     let banner = this._document.nativeElement.querySelector(`[id="${this.bottombanner}"]`);
    //     if (banner) {
    //         this._renderer.removeAttribute(banner, 'hidden')
    //     }
    // }

    navigateToPreferencePage(): void {
        this._service.navigateToPreferencePage(this._router)
    }

    // Listen to the window's scroll event
    @HostListener('window:scroll', [])
    onScroll() {
        const scrollPosition = window.scrollY; // Current scroll position
        const scrollHeight = document.documentElement.scrollHeight; // Total document height
        const clientHeight = document.documentElement.clientHeight; // Visible height

        // Condition to show/hide the button
        if (scrollPosition < scrollHeight - clientHeight) {
            this.srollDownBtnVisible = true;
        } else {
            this.srollDownBtnVisible = false;
        }
    }

    // Scroll to the end when the div is clicked
    scrollToEnd() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
}
