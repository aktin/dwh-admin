import { AuthState, authState } from "../state/auth.state";
import { AuthActions } from "../actions/auth.actions";
import {ActionReducer} from "@ngrx/store";

export function authReducer (state = authState, action: AuthActions): AuthState {
  switch (action.type) {
    default:
      return state;
  }
}

export const authReducers: ActionReducer<AuthState> = authReducer;
