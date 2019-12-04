import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";
import { AuthService } from "../../services";
import { EMPTY } from "rxjs";

@Injectable()
export class AuthEffects {
  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.UserLogin),
    concatMap(
        (value ) => this._auth.userLogin(value.payload.username, value.payload.password)
            .pipe(
                map(
                    user => ({type: AuthActionTypes.UserLoginSuccess, payload: {currentUser: user}})
                ),
                catchError((err) => {
                    console.log(err);
                    return EMPTY
                })
            )
            /*
        * UserLogin {payload: {…}, type: "[Auth] Log In User"}
payload: {username: "i2b2", password: "demouser"}
type: "[Auth] Log In User"
* */
    ),
  );
  constructor(private actions$: Actions<AuthActions>, private _auth: AuthService) {}
}
