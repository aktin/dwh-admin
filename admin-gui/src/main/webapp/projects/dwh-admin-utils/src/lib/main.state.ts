import { RouterReducerState } from "@ngrx/router-store";
import { Store } from "@ngrx/store";

export interface State {
  router?: RouterReducerState;
}

export const state: State = {};

export function getInitialState(): State {
  return state;
}

// export type aktinStore = Store<State>;
