import { Action } from "@ngrx/store";
import { User } from "../../models/user";
import { Permission } from "../../permission";

export enum AuthActionTypes {
  UserLogin = "[Auth] Log In User",
  UserLoginSuccess = "[Auth] Log In User Success",
  CurrentUser = "[Auth] Get Current User",
  CurrentUserUpdate = "[Auth] Update Current User",
  CurrentUserUpdated = "[Auth] Update Current User Success",
  PermissionsList = "[Auth] Get Permissions",
  PermissionsUpdate = "[Auth] Load Permissions",
  PermissionsUpdated = "[Auth] Load Permissions Success",
}

export class UserLogin implements Action {
  readonly type = AuthActionTypes.UserLogin;
  
  constructor(public payload: { username: string, password : string }) {}
}
export class UserLoginSuccess implements Action {
  readonly type = AuthActionTypes.UserLoginSuccess;
  constructor(public payload: { currentUser: User }) {}
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

export type AuthActions =
  | UserLogin
  | UserLoginSuccess
  | CurrentUser
  | CurrentUserUpdate
  | CurrentUserUpdated
  | PermissionsList
  | PermissionsUpdate
  | PermissionsUpdated;
