/**
 * Created by Xu on 18.05.2017.
 * Property service
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineLatest';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService }                from '../helpers/index';
import { predefinedPreferenceCategories, predefinedPreferences, PreferenceCategory, Preference } from './preference';

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
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService
    ) {}

    updatePreferences (): void {
        this._http.debouncedGet<void> (
            'preferences',
            null, null,
            this._dataInterval,
            this._urls.parse('prefs'),
            (res: Response) => {
                let data = res.json();
                let keys = Object.keys(data);
                _.each(keys, (k: string) => this.insertPreference(k, data[k]));
                this._store.setValue('preferences', JSON.stringify(PreferenceService._categories));
                return res.text();
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

        let cat: PreferenceCategory = _.findWhere(PreferenceService._categories, {value : catName} )  // is it in categories?
                            || _.findWhere(predefinedPreferenceCategories, {value : catName} )  // is it in predefined ones?
                            || _.findWhere(PreferenceService._categories, {value : ''} )        // is the empty one there?
                            || _.findWhere(predefinedPreferenceCategories, {value : ''} )       // is the empty one in predefined ones?
                            || {value : catName, name : catName, description : catName};
                                        // insert new category. Should never arrive here if the empty one is predefined

        if (! _.contains(PreferenceService._categories, cat)) {
            cat.preferences = [];
            cat.location = this._fileLocation;
            PreferenceService._categories.push(cat);
        }

        let pref = _.findWhere(cat.preferences, {key : key});
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
