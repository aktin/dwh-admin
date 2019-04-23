import { Component, OnInit } from "@angular/core";
import { UrlService, State } from "@aktin/utils";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Report } from "../../models";
import { getReportsAsArray, ReportUpdate } from "../../store";
import { ReportService } from "../../report.service";
/**
 *
 */
@Component({
  selector: "admin-gui-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["../../reports.css"],
})
export class ReportsListComponent implements OnInit {
  reports$: Observable<Report[]>;
  constructor(private _url: UrlService, private _store: Store<State>, private s: ReportService) {}

  ngOnInit() {
    console.log("init list");
    this._store.dispatch(new ReportUpdate());
    this.reports$ = this._store.pipe(select(getReportsAsArray));
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
