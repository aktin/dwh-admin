import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UrlService, State } from "@aktin/utils";
import { User } from "../../models/user";
import { AuthService } from "../../services";
import { of } from "rxjs/internal/observable/of";

@Component({
  selector: "auth-login",
  templateUrl: "./auth-login.component.html",
  styles: [],
})
export class AuthLoginComponent implements OnInit {
  @Input() menu: boolean = false;
  @Input() username: string;
  @Input() password: string = "";
  user$: Observable<User>;
  constructor(
    private _route: ActivatedRoute,
    private _url: UrlService,
    private _auth: AuthService,
    private _store: Store<State>,
  ) {}

  ngOnInit() {
    // this.u = new User(this.username);
    // this.user$ = of(this.u);
  }

  get hasUser() {
    return false && this.username !== "";
  }

  userLogout() {
    console.log("logout");
  }

  login() {
    console.log("logging in ", this.username, " ", this.password);
    this._auth.userLogin(this.username, this.password).subscribe((res) => {
      console.log("something with res: ", res)
    });
  }
}
