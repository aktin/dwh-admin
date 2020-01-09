import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { LocalStorageService, State, storageMetaReducer } from "@aktin/utils";
import { environment } from "@env/environment";
import { debug } from "@app/store/reducers/debug-log.metareducers";
import { getMetaReducers, localStorageKey } from "@app/store/reducers/metareducers";
import { saveKeys } from "@app/auth/store";

export const reducers: ActionReducerMap<State> = {};

export * from "./metareducers";
