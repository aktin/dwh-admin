/**
 * Created by Xu on 08.08.2017.
 */
import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';

@Injectable()
export class CleanUpAuthService {

    constructor (
        private _store: StorageService,
        private _router: Router
    ) {}

    cleanUpStorage (msg?: string): void {
        let url = this._store.getValue('route');
        this._store.clear();
        this._store.setValue('route', url);
        if (msg) {
            this._store.setValue('auth-messages', msg);
        }
    }
    redirect2Home (url?: string): void {
        if (!url) {
            url = this._router.url;
        }
        this._store.setValue('route', url);
        this._router.navigate(['']);
    }
    redirect2Route () {
        let url = this._store.getValue('route');
        this._store.deleteValue('route');
        this._router.navigate([url]);
    }
}
