import { Action } from "@ngrx/store";
import { User,Permission } from "../../models";

export enum AuthActionTypes {
    UserLogin = "[Auth] Log In User",
    UserLoginSuccess = "[Auth] Log In User Success", // also start get permissions
    UserLoginFailure = "[Auth] Log In User Failure",
    CurrentUser = "[Auth] Get Current User",
    CurrentUserUpdate = "[Auth] Update Current User",
    CurrentUserUpdated = "[Auth] Update Current User Success",
    PermissionsList = "[Auth] Get Permissions",
    PermissionsUpdate = "[Auth] Load Permissions",
    PermissionsUpdated = "[Auth] Load Permissions Success",
    AuthCheck = "[Auth] Check Authentication",
    AuthCheckSuccess = "[Auth] Check Authentication Success",
    AuthCheckFailure = "[Auth] Check Authentication Failure", // removes all permissions and user data
    UserLogout = "[Auth] Log Out User",
    UserLogoutSuccess = "[Auth] Log Out User Success", // removes all permissions and user data
}

export class UserLogin implements Action {
    readonly type = AuthActionTypes.UserLogin;
    
    constructor(public payload: { username: string, password : string }) {}
}
export class UserLoginSuccess implements Action {
    readonly type = AuthActionTypes.UserLoginSuccess;
    constructor(public payload: { currentUser: User }) {}
}
export class UserLoginFailure implements Action {
    readonly type = AuthActionTypes.UserLoginFailure;
    constructor(public payload: { error: Error }) {}
}
export class CurrentUser implements Action {
    readonly type = AuthActionTypes.CurrentUser;
    constructor(public payload: { currentUser: User }) {}
}

export class CurrentUserUpdate implements Action {
    readonly type = AuthActionTypes.CurrentUserUpdate;
}

export class CurrentUserUpdated implements Action {
    readonly type = AuthActionTypes.CurrentUserUpdated;
    constructor(public payload: { currentUser: User }) {}
}

export class PermissionsList implements Action {
    readonly type = AuthActionTypes.PermissionsList;
    constructor(public payload: { permissions: Permission[] }) {}
}

export class PermissionsUpdate implements Action {
    readonly type = AuthActionTypes.PermissionsUpdate;
}

export class PermissionsUpdated implements Action {
    readonly type = AuthActionTypes.PermissionsUpdated;
    constructor(public payload: { permissions: Permission[] }) {}
}

export class AuthCheck implements Action {
    readonly type = AuthActionTypes.AuthCheck;
}

export class AuthCheckSuccess implements Action {
    readonly type = AuthActionTypes.AuthCheckSuccess;
}

export class AuthCheckFailure implements Action {
    readonly type = AuthActionTypes.AuthCheckFailure;
    constructor(public payload: { error: Error }) {}
}

export class UserLogout implements Action {
    readonly type = AuthActionTypes.UserLogout;
}

export class UserLogoutSuccess implements Action {
    readonly type = AuthActionTypes.UserLogoutSuccess;
}
export type AuthActions =
    | UserLogin
    | UserLoginSuccess
    | UserLoginFailure
    | CurrentUser
    | CurrentUserUpdate
    | CurrentUserUpdated
    | PermissionsList
    | PermissionsUpdate
    | PermissionsUpdated
    | AuthCheck
    | AuthCheckSuccess
    | AuthCheckFailure
    | UserLogout
    | UserLogoutSuccess
    ;
