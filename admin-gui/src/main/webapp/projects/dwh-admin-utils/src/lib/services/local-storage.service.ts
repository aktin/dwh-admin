import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private _synced = false;
    private _timestamp = null;
    
    constructor() {}
    
    get synced () {
        return this._synced;
    }
    
    sync() {
        this._synced = true;
        this._timestamp = (+ new Date()) ;
    }
    
    desync() {
        this._synced = false;
    }
    
    get time () {
        return this._timestamp;
    }
    
    isCurrentTime () {
        return Math.abs(this._timestamp - (+new Date())) < 1000;
    }
    
    setSavedState(state: any, localStorageKey: string) {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }
    
    getSavedState(localStorageKey: string): any {
        return JSON.parse(localStorage.getItem(localStorageKey));
    }
}
