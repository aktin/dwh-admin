import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

import { AuthLoginComponent } from "./components/auth-login/auth-login.component";
import {authReducer, authReducers} from "./store/reducers/auth.reducer";
import {AuthEffects} from "./store/effects/auth.effects";

const AUTHCOMPONENTS = [AuthLoginComponent];

@NgModule({
  declarations: AUTHCOMPONENTS,
  entryComponents: AUTHCOMPONENTS,
  imports: [CommonModule, FormsModule,
    StoreModule.forFeature("authentication", authReducers),
    EffectsModule.forFeature([AuthEffects]),],
  exports: [AuthLoginComponent],
})
export class AuthModule {}
