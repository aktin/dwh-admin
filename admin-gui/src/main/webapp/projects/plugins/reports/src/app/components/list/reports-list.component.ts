import { Component, OnInit } from "@angular/core";
import { UrlService, State } from "@aktin/utils";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Report } from "../../models";
import {getReportsAsArray, ReportUpdate} from "../../store";
import { ReportService } from "../../services/report.service";
/**
 *
 */
@Component({
  selector: "admin-gui-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["../../main.css"],
})
export class ReportsListComponent implements OnInit {
  reports$: Observable<Report[]>;
  constructor(private _url: UrlService, private _store: Store<State>, private s: ReportService) {}

  ngOnInit() {
    this._store.dispatch(new ReportUpdate());
    this.reports$ = this._store.pipe(select(getReportsAsArray));
  }
}
