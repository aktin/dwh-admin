/**
 * Created by Xu on 03.05.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    myStore: Storage = sessionStorage;

    setValue (key: string, value: string): void {
        this.myStore.setItem(key, value);
    }

    getValue (key: string): string {
        return this.myStore.getItem(key);
    }

    deleteValue (key: string): string {
        let val = this.myStore.getItem(key);
        this.myStore.removeItem(key);
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
        this.myStore.clear();
    }
}
