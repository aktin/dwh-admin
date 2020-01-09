import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "@env/environment";
import { State } from "@aktin/utils";
import { debug } from "./debug-log.metareducers";

export const reducers: ActionReducerMap<State> = {};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [debug] : [];
