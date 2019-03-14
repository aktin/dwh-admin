import { Component, OnInit } from "@angular/core";
import { UrlService } from "@aktin/utils";
import { Store } from "@ngrx/store";
import { ReportState } from "@app/reports/store/report.state";
import { LoadReports, UpdateReports } from "@app/reports/store/actions/report.actions";
import { ReportService } from "@app/reports/report.service";

@Component({
  selector: "admin-gui-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["../../reports.css"],
})
export class ReportsListComponent implements OnInit {
  constructor(
    private _url: UrlService,
    private _store: Store<ReportState>,
    private _report: ReportService,
  ) {}

  ngOnInit() {
    console.log("init list");
    this._store.dispatch(new UpdateReports());
    this._report.updateReports();
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
