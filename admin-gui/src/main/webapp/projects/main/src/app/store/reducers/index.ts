import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "@env/environment";
// import { AppState } from "@app/store/state/app.state";
import { AppState } from "@aktin/utils";

export const reducers: ActionReducerMap<AppState> = {};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];