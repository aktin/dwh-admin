import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { EMPTY, interval, of } from "rxjs";
import { catchError, exhaustMap, map, mapTo, publish, refCount, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { AuthService } from "../../services";
import { AuthState } from "../state";
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";
import { checkAuthentication, getToken } from "../selectors/auth.selectors";
import { Subscription } from "rxjs/internal/Subscription";

@Injectable()
export class AuthEffects {
    @Effect()
    loginUser$ = this.actions$.pipe(
        ofType(AuthActionTypes.UserLogin),
        exhaustMap(
            (action) => this._auth.userLogin(action.payload.username, action.payload.password)
                .pipe(
                    map(
                        user =>  {
                            if (user) {
                                // this._store.setValue('user.auth.time', String(Date.now()));
                                return ({type: AuthActionTypes.UserLoginSuccess, payload: {currentUser: user}});
                            }
                            return ({type: AuthActionTypes.UserLoginFailure, payload : {error: new Error("User Object Empty")}});
                        }
                    ),
                    catchError((error) => of ({type: AuthActionTypes.UserLoginFailure, payload : {error: error}}))
                )
        ),
    );
    
    @Effect({dispatch:false})
    loginFail = this.actions$.pipe(
        ofType(AuthActionTypes.UserLoginFailure),
        tap ( (action) => {
            console.log("Log In Attempt failed. Check Input!", action.payload.error);
        })
    );
    
    @Effect()
    permissionsUpdate$ = this.actions$.pipe(
        ofType(AuthActionTypes.PermissionsUpdate, AuthActionTypes.UserLoginSuccess),
        switchMap(
            ( ) => this._auth.getPermissions()
                .pipe(
                    // tap((res) => console.log("tapping", res)),
                    map((res) =>({type: AuthActionTypes.PermissionsUpdated, payload: {permissions: res}})),
                    catchError((error) => {
                        console.log(error);
                        return EMPTY;
                    })
                )
        )
    );
    
    @Effect()
    authCheck$ = this.actions$.pipe(
        ofType(AuthActionTypes.AuthCheck, AuthActionTypes.UserLoginSuccess),
    
        tap( () => {
            console.log('release');
            getToken.release();
            checkAuthentication.release();
        }),
        withLatestFrom(this._store.pipe(select(getToken))),
        withLatestFrom(this._store.pipe(select(checkAuthentication))),
        exhaustMap(
            ([action, token]) => {
                if (token) {
                    return this._auth.authCheck().pipe(
                        tap ((res) => {
                            console.log(action, token, res)
                        }),
                        map(() => {
                            this.acSubscribe();
                            return ({ type: AuthActionTypes.AuthCheckSuccess });
                        }),
                        catchError((error) => of({ type: AuthActionTypes.AuthCheckFailure, payload: { error: error } }))
                    )
                }
                return of({ type: AuthActionTypes.AuthCheckFailure, payload: { error: new Error("No Token") } });
            }
        )
    );
    
    @Effect()
    logout$ = this.actions$.pipe(
        ofType(AuthActionTypes.UserLogout),
        exhaustMap(
            ( ) => this._auth.userLogout().pipe(
                map(
                    (res) => {
                        console.log(res);
                        return ({type: AuthActionTypes.UserLogoutSuccess});
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return of (({type: AuthActionTypes.UserLogoutSuccess}));
                    }
                )
            )
        )
    );
    
    @Effect({dispatch:false})
    authCheckFailure$ = this.actions$.pipe(
        ofType(AuthActionTypes.AuthCheckFailure, AuthActionTypes.UserLogoutSuccess),
        tap ( () => {
            this.acUnsubscribe();
        })
    );
    /**
     *
     * @param actions$
     * @param _auth
     * @param _store
     */
    constructor(private actions$: Actions<AuthActions>, private _auth: AuthService, private _store: Store<AuthState>) {}
    
    
    /**
     * Periodically check the authentication
     */
        // @Effect()
    intervalAuthCheck$ = interval(10000).pipe(
        publish(),
        refCount(),
        mapTo(() => {
            // console.log("tick");
            return ({type: AuthActionTypes.AuthCheck});
        })
    );
    authCheckSubscribe : Subscription = null;
    acSubscribe () {
        // console.log("sub ", this.authCheckSubscribe);
        if (this.authCheckSubscribe == null) {
            this.authCheckSubscribe = this.intervalAuthCheck$.subscribe( (func) => {
                // console.log("in sub");
                (func)();
            });
            // console.log("sub 1", this.authCheckSubscribe);
        }
    };
    acUnsubscribe () {
        if (this.authCheckSubscribe) {
            this.authCheckSubscribe.unsubscribe();
            this.authCheckSubscribe = null;
        }
    }
    
}
