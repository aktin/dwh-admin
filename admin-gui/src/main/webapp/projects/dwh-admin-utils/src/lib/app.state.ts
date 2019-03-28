import { RouterReducerState } from "@ngrx/router-store";

export interface AppState {
  router?: RouterReducerState;
}

export const appState: AppState = {};

export function getInitialState(): AppState {
  return appState;
}
