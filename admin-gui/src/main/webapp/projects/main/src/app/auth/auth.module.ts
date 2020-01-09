import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

import { AuthLoginComponent } from "./components/auth-login/auth-login.component";
import { authReducers, AuthEffects } from "./store/";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthTokenInterceptor } from "./services/auth-token.interceptor";

const AUTHCOMPONENTS = [AuthLoginComponent];

@NgModule({
  declarations: AUTHCOMPONENTS,
  entryComponents: AUTHCOMPONENTS,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreModule.forFeature("authentication", authReducers),
    EffectsModule.forFeature([AuthEffects]),],
  exports: [AuthLoginComponent],
  providers : [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi   : true,
    },
  ]

})
export class AuthModule {}
