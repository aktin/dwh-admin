import {
  Compiler,
  COMPILER_OPTIONS,
  CompilerFactory,
  NgModule
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { JitCompilerFactory } from "@angular/platform-browser-dynamic";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers, metaReducers } from "./reducers";
import { EffectsModule } from "@ngrx/effects";
import { AppEffects } from "./app.effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

import { environment } from "@env/environment";

import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material";

import { AppComponent } from "@app/app.component";
import { TestDummyComponent } from "@app/test-dummy";
import { ReportsModule } from "@app/reports";
import { UrlService } from "@app/routing";
import { APP_ROUTES_FUSING, APP_LAST_ROUTES } from "@app/routing/app.routes";

export function createCompiler(fn: CompilerFactory): Compiler {
  return fn.createCompiler();
}

@NgModule({
  declarations: [AppComponent, TestDummyComponent],
  imports: [
    RouterModule.forRoot([], { useHash: true }),
    BrowserModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    MaterialModule,
    ReportsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot(),
    BrowserAnimationsModule
  ],
  exports: [],
  providers: [
    UrlService,
    {
      provide: COMPILER_OPTIONS,
      useValue: {},
      multi: true
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
