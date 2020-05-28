import { Compiler, COMPILER_OPTIONS, CompilerFactory, NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { JitCompilerFactory } from "@angular/platform-browser-dynamic";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { META_REDUCERS, StoreModule, USER_PROVIDED_META_REDUCERS } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule, DefaultRouterStateSerializer } from "@ngrx/router-store";
import { getMetaReducers, localStorageKey, reducers, stateKeys } from "@app/store/reducers";
import { AppEffects } from "@app/store/effects/app.effects";

import { environment } from "@env/environment";

import { CoreModule } from "@app/core";

import { AppComponent } from "@app/app.component";

import { AppRouterModule } from "@app/routing";
import { HomeComponent, TestDummyComponent, ErrorComponent } from "@app/default";

export function createCompiler(fn: CompilerFactory): Compiler {
    return fn.createCompiler();
}

import { getLocaleId, registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import { AuthModule, LocalStorageService } from "@aktin/utils";
import { ROOT_LOCAL_STORAGE_KEY, ROOT_STORAGE_KEYS } from "@app/app.tokens";
registerLocaleData(localeDe, "de");

const APPCOMPONENTS = [AppComponent, HomeComponent, TestDummyComponent, ErrorComponent];

@NgModule({
    declarations: APPCOMPONENTS,
    entryComponents: APPCOMPONENTS,
    imports: [
        AppRouterModule,
        // DwhAdminUtilsModule.forRoot(APP_ROUTES_NAMES),
        // RouterModule.forRoot(APP_ROUTES_FUSING(), { useHash: true }),
        BrowserModule,
        CoreModule.forRoot(),
        BrowserAnimationsModule,
        
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([AppEffects]),
        !environment.production
            ? StoreDevtoolsModule.instrument({
                maxAge: 25,
                logOnly: environment.production,
            })
            : [],
        StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),
        AuthModule,
    ],
    exports: [],
    providers: [LocalStorageService,
        { provide: LOCALE_ID, useValue: "de-DE" },
        { provide: ROOT_STORAGE_KEYS, useValue: stateKeys },
        { provide: ROOT_LOCAL_STORAGE_KEY, useValue: localStorageKey },
        {
            provide   : USER_PROVIDED_META_REDUCERS,
            deps      : [ ROOT_STORAGE_KEYS, ROOT_LOCAL_STORAGE_KEY, LocalStorageService ],
            useFactory: getMetaReducers,
        },
        {
            provide   : COMPILER_OPTIONS,
            useValue  : {},
            multi     : true,
        },
        {
            provide   : CompilerFactory,
            useClass  : JitCompilerFactory,
            deps      : [COMPILER_OPTIONS],
        },
        {
            provide   : Compiler,
            useFactory: createCompiler,
            deps      : [CompilerFactory],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {}
}
