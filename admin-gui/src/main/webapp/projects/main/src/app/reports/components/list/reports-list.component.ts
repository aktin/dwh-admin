import { Component, OnInit } from "@angular/core";
import { UrlService } from "@aktin/utils";
import { select, Store } from "@ngrx/store";
import { ReportService } from "../../report.service";
import { Observable } from "rxjs";
import { Report } from "@app/reports/models";
import { getReportsAsArray, ReportUpdate } from "@app/reports/store";
// import { AppState } from "@app/store/state/app.state";
import { AppState } from "@aktin/utils";

@Component({
  selector: "admin-gui-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["../../reports.css"],
})
export class ReportsListComponent implements OnInit {
  reports$: Observable<Report[]>;
  constructor(private _url: UrlService, private _store: Store<AppState>) {}

  ngOnInit() {
    console.log("init list");
    this._store.dispatch(new ReportUpdate());
    this.reports$ = this._store.pipe(select(getReportsAsArray));
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }

  printReports() {}
}
