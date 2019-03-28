import { Compiler, COMPILER_OPTIONS, CompilerFactory, NgModule } from "@angular/core";
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
import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material";

import { AppComponent } from "@app/app.component";
import { ReportsModule } from "@app/reports";

import { AppRouterModule } from "@app/routing/app-router.module";
import { HomeComponent, TestDummyComponent, ErrorComponent } from "@app/default";

export function createCompiler(fn: CompilerFactory): Compiler {
  return fn.createCompiler();
}

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
    SharedModule.forRoot(),
    ReportsModule,

    MaterialModule,
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
export class AppModule {}
