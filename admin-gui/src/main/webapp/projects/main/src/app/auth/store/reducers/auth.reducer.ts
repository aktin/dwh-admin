import { AuthState, authState } from "../state/auth.state";
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";
import { ActionReducer } from "@ngrx/store";

export function authReducer (state = authState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.UserLoginSuccess : {
      return { ...state, currentUser: action.payload.currentUser }
    }
    
    default:
      return state;
  }
}

export const authReducers: ActionReducer<AuthState> = authReducer;
