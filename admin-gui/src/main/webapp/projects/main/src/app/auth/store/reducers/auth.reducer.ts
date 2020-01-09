import { ActionReducer } from "@ngrx/store";
import { AuthState, authState } from "../state/auth.state";
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";

export function authReducer (state = authState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.UserLoginSuccess : {
            return { ...state, currentUser: action.payload.currentUser };
        }
        case AuthActionTypes.PermissionsUpdated : {
            return { ...state, permissions: action.payload.permissions };
        }
        case AuthActionTypes.UserLogout : // removing data directly on logout, not by success!
        case AuthActionTypes.AuthCheckFailure : {
            console.log(action.type, "removing permissions and currentUser");
            return { ...state, permissions: [], currentUser: null};
        }
        default:
            return state;
    }
}

export const authReducers: ActionReducer<AuthState> = authReducer;
