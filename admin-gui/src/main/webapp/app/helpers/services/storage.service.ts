/**
 * Created by Xu on 03.05.2017.
 */
import { Injectable } from '@angular/core';
import _ = require('underscore');

@Injectable()
export class StorageService {
    setValue (key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    getValue (key: string): string {
        return localStorage.getItem(key);
    }

    deleteValue (key: string): string {
        let val = localStorage.getItem(key);
        localStorage.removeItem(key);
        return val;
    }

    getTime (key: string): number {
        return +(this.getValue(key + '.time') || 0);
    }
    setTime (key: string): void {
        return this.setValue(key + '.time', String(Date.now()));
    }

    /**
     * remove all data from storage. really clean then
     */
    clear (): void {
        localStorage.clear();
    }
}
