import { MetaReducer } from "@ngrx/store";
import { environment } from "@env/environment";
import { debug } from "@app/store/reducers/debug-log.metareducers";
import { LocalStorageService, State, storageMetaReducer } from "@aktin/utils";

// the keys from state which we'd like to save.
export const stateKeys = [];
// the key for the local storage.
export const localStorageKey = '__app_storage__';

// factory meta-reducer configuration function
export function getMetaReducers(saveKeys: string[], localStorageKey: string, storageService: LocalStorageService): MetaReducer<State>[] {
    let metaReducers = [storageMetaReducer(saveKeys, localStorageKey, storageService)];
    if (!environment.production) {
        // metaReducers.push(debug);
    }
    return metaReducers;
}
