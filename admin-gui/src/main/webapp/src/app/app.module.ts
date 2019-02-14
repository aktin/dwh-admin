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

import { APP_ROUTES } from "@app/app.routes";
import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material";

import { AppComponent } from "@app/app.component";
import { TestDummyComponent } from "@app/test-dummy/test-dummy.component";

export function createCompiler(fn: CompilerFactory): Compiler {
  return fn.createCompiler();
}

@NgModule({
  declarations: [AppComponent, TestDummyComponent],
  imports: [
    RouterModule.forRoot(APP_ROUTES, { useHash: true }),
    BrowserModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    MaterialModule,
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
