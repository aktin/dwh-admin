import { InjectionToken } from "@angular/core";
import { StoreConfig } from "@ngrx/store";
import { AuthActions, AuthState } from "./store";

export const AUTH_STORAGE_KEYS = new InjectionToken<keyof AuthState[]>('AuthStorageKeys');
export const AUTH_LOCAL_STORAGE_KEY = new InjectionToken<string[]>('AuthStorage');
export const AUTH_CONFIG_TOKEN = new InjectionToken<StoreConfig<AuthState, AuthActions>>('AuthConfigToken');
