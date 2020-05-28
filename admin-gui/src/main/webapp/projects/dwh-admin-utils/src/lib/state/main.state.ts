import { RouterReducerState } from "@ngrx/router-store";

export interface State {
  router?: RouterReducerState;
}

export const state: State = {};

export function getInitialState(): State {
  return state;
}

