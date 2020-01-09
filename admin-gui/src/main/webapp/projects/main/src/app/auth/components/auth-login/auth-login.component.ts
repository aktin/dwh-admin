import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UrlService, State } from "@aktin/utils";
import { User } from "../../models";
import { AuthService } from "../../services";
import { UserLogin, getCurrentUser, checkAuthentication, UserLogout } from "../../store";

@Component({
    selector: "auth-login",
    templateUrl: "./auth-login.component.html",
    styles: [],
})
export class AuthLoginComponent implements OnInit {
    @Input() menu: boolean = false;
    @Input() username: string;
    @Input() password: string = "";
    isAuthenticated$ : Observable<boolean>;
    user$: Observable<User>;
    constructor(
        private _route: ActivatedRoute,
        private _url: UrlService,
        private _auth: AuthService,
        private _store: Store<State>,
    ) {
    }
    
    ngOnInit() {
        this.user$ = this._store.pipe(select(getCurrentUser));
        this.isAuthenticated$ = this._store.pipe(select(checkAuthentication));
    }
    
    userLogout() {
        // console.log("logout");
        this._store.dispatch(new UserLogout);
    }
    
    login() {
        // console.log("logging in ", this.username, " ", this.password);
        this._store.dispatch(new UserLogin({username: this.username, password: this.password}));
    }
}
