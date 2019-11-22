import { createFeatureSelector, createSelector } from "@ngrx/store";

import { AuthState } from "../state";
import {User} from "../../models/user";

export const selectAuthenticationState = createFeatureSelector<AuthState>("authentication");

export const getCurrentUser = createSelector(
    selectAuthenticationState,
    (state: AuthState) => {
        if  (state.currentUser)
            return state.currentUser;
        return null;
        },
);
export const getToken = createSelector(
    getCurrentUser,
    (user: User) => {
        if  (user)
            return user.token;
        return null;
    },
);
