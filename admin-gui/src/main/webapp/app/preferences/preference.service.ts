/**
 * Created by Xu on 18.05.2017.
 * Property service
 */
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineLatest';

import _ = require('underscore');

import { HttpHandlerService, StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { predefinedPrefCats, predefinedPrefs, PrefCategory, Preference } from './preference';

/**
 * Service Class for user management and LOGIN
 *
 * using the helper service HTTP Handler for
 *      handleError
 *      debouncedGet
 */
@Injectable()
export class PreferenceService {
    private static cats: PrefCategory[] = [];
    private dataInterval = 3000;
    private fileLocation = '/opt/wildfly-9..0.2-Final/standalone/configuration/aktin.properties';

    constructor (
        private httpHandler: HttpHandlerService,
        private http: HttpInterceptorService,
        private urls: UrlService,
        private store: StorageService
    ) {}

    updateProperties (): void {
        this.httpHandler.debouncedGet<void> (
            'prefs',
            null, null,
            this.dataInterval,
            this.urls.parse('prefs'),
            (res: Response) => {
                let data = res.json();
                let keys = Object.keys(data);
                _.each(keys, (k: string) => this.insertPref(k, data[k]));
                this.store.setValue('prefs', JSON.stringify(PreferenceService.cats));
                return res.text();
            }, (err: Response) => {
                return err;
            }, this.http, this.store
        ).subscribe(
            rep => {
            },
            error => console.log(error)
        );
    }

    insertPref ( key: string, value: string ): [PrefCategory, Preference] {
        let catName = key.split('.')[0];

        let cat: PrefCategory = _.findWhere(PreferenceService.cats, {value : catName} )
                            || _.findWhere(predefinedPrefCats, {value : catName} )
                            || _.findWhere(PreferenceService.cats, {value : ''} )
                            || _.findWhere(predefinedPrefCats, {value : ''} )
                            || {value : catName, name : catName, descr : catName};

        if (! _.contains(PreferenceService.cats, cat)) {
            cat.prefs = [];
            cat.location = this.fileLocation;
            PreferenceService.cats.push(cat);
        }

        let pref = _.findWhere(cat.prefs, {key : key});
        if (pref) {
            pref.value = value;
        } else {
            pref = {key: key, value : value, descr : predefinedPrefs[key] || key};
            cat.prefs.push(pref);
        }
        return [cat, pref];
    }

    getPrefCats (): PrefCategory[] {
        this.updateProperties();
        return PreferenceService.cats;
    }

    getFileLocation (): string {
        return this.fileLocation;
    }
}
