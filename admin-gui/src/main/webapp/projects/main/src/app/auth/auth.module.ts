import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

import { LocalStorageService } from "@aktin/utils";

import { AuthLoginComponent } from "./components/auth-login/auth-login.component";
import { authReducers, AuthEffects, getAuthConfig, localStorageKey, saveKeys  } from "./store/";
import { AuthTokenInterceptor } from "./services/auth-token.interceptor";
import { AUTH_CONFIG_TOKEN, AUTH_LOCAL_STORAGE_KEY, AUTH_STORAGE_KEYS } from "./auth.tokens";

const AUTHCOMPONENTS = [AuthLoginComponent];

@NgModule({
    declarations: AUTHCOMPONENTS,
    entryComponents: AUTHCOMPONENTS,
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        StoreModule.forFeature("authentication", authReducers, AUTH_CONFIG_TOKEN),
        EffectsModule.forFeature([AuthEffects]),],
    exports: [AuthLoginComponent],
    providers : [
        {provide: AUTH_LOCAL_STORAGE_KEY, useValue: localStorageKey},
        {provide: AUTH_STORAGE_KEYS, useValue: saveKeys},
        {
            provide   : AUTH_CONFIG_TOKEN,
            deps      : [AUTH_STORAGE_KEYS, AUTH_LOCAL_STORAGE_KEY, LocalStorageService],
            useFactory: getAuthConfig
        },
        {
            provide : HTTP_INTERCEPTORS,
            useClass: AuthTokenInterceptor,
            multi   : true,
        },
    ]
    
})
export class AuthModule {}
