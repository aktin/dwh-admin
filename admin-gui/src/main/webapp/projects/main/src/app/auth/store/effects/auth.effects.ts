import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";
import { AuthenticationService } from "../../authentication.service";
import { concatMap, mergeMap } from "rxjs/operators";

@Injectable()
export class AuthEffects {
  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.UserLogin),
    concatMap((value, index) => {
      console.log(value);
      return this._auth.userLogin("i2b2", "demouser");
    }),
  );
  constructor(private actions$: Actions<AuthActions>, private _auth: AuthenticationService) {}
}
