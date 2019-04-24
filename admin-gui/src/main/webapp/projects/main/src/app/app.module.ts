import { Compiler, COMPILER_OPTIONS, CompilerFactory, NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { JitCompilerFactory } from "@angular/platform-browser-dynamic";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers, metaReducers } from "@app/store/reducers";
import { EffectsModule } from "@ngrx/effects";
import { AppEffects } from "@app/store/effects/app.effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

import { environment } from "@env/environment";

import { CoreModule } from "@app/core";

import { AppComponent } from "@app/app.component";

import { AppRouterModule } from "@app/routing/app-router.module";
import { HomeComponent, TestDummyComponent, ErrorComponent } from "@app/default";

export function createCompiler(fn: CompilerFactory): Compiler {
  return fn.createCompiler();
}

import { getLocaleId, registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
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

    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AppEffects]),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
          logOnly: environment.production,
        })
      : [],
    StoreRouterConnectingModule.forRoot(),
  ],
  exports: [],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    {
      provide: COMPILER_OPTIONS,
      useValue: {},
      multi: true,
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
