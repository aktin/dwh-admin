import { Component, OnInit } from "@angular/core";
import { UrlService, State } from "@aktin/utils";
import { select, Store } from "@ngrx/store";
import { getCasesAsArray, CasesUpdate } from "./store";
import { Observable } from "rxjs";
import { Case } from "./models";

@Component({
  selector: "case-component",
  templateUrl: "./case.component.html",
  styleUrls: ["./case.component.css"],
})
export class CaseComponent implements OnInit {
  state = { link: "" };
  reports$: Observable<Case[]>;
  constructor(private _url: UrlService, private _store: Store<State>) {
    console.log(this._url.link(["HOME"]));
    this.state.link = this.getUrls("REPORT", "SINGLE");
  }

  ngOnInit() {
    console.log("init list");
    this._store.dispatch(new CasesUpdate());
    this.reports$ = this._store.pipe(select(getCasesAsArray));
  }
  getUrls(...routes) {
    if (!this._url) return routes.join("/");
    return "#" + this._url.link(routes);
  }
}
