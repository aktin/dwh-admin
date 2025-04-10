/**
 * Created by Xu on 18.05.2017.
 * Property service
 */
import {Injectable} from '@angular/core';


import {HttpService, StorageService, UrlService} from '../helpers/index';
import {predefinedPreferenceCategories, predefinedPreferences, Preference, PreferenceCategory} from './preference';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

/**
 * Service Class for user management and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class PreferenceService {
    private static _categories: PreferenceCategory[] = [];
    private _dataInterval = 3000;
    private _fileLocation = '/opt/wildfly/standalone/configuration/aktin.properties';

    constructor (
        private _http: HttpService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    updatePreferences (): void {
        this._http.debouncedGet<void> (
            'preferences',
            null, null,
            this._dataInterval,
            this._urls.parse('prefs'),
            res => {
                let data: any = res;
                let keys = Object.keys(data);
                keys.forEach((k: string) => this.insertPreference(k, data[k]));
                this._store.setValue('preferences', JSON.stringify(PreferenceService._categories));
                return res;
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            ( /*rep*/ ) => {
            },
            error => console.log(error)
        );
    }

    insertPreference (key: string, value: string ): [PreferenceCategory, Preference] {
        let catName = key.split('.')[0];

        let cat: PreferenceCategory = PreferenceService._categories.find(c  => c.value === catName)  // is it in categories?
                            || predefinedPreferenceCategories.find(c  => c.value === catName)  // is it in predefined ones?
                            || PreferenceService._categories.find(c =>  c.value === '')        // is the empty one there?
                            || predefinedPreferenceCategories.find(c => c.value === '')       // is the empty one in predefined ones?
                            || {value: catName, name: catName, description: catName};
                                        // insert new category. Should never arrive here if the empty one is predefined

        if (! PreferenceService._categories.includes(cat)) {
            cat.preferences = [];
            cat.location = this._fileLocation;
            PreferenceService._categories.push(cat);
        }

        let pref = cat.preferences.find(p => p.key === key);
        if (pref) {
            pref.value = value;
        } else {
            pref = {key: key, value : value, description : predefinedPreferences[key] || key};
            cat.preferences.push(pref);
        }
        return [cat, pref];
    }

    getPreferenceCategories (): PreferenceCategory[] {
        this.updatePreferences();
        return PreferenceService._categories;
    }

    getFileLocation (): string {
        return this._fileLocation;
    }
}
