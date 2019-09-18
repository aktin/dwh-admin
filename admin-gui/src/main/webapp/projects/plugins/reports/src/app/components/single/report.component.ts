import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { UrlService, State } from "@aktin/utils";
import { Report } from "../../models";
import { ReportUpdate, selectReport } from "../../store";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "admin-gui-report",
  templateUrl: "./report.component.html",
  styleUrls: ["../../main.css"],
})
export class ReportComponent implements OnInit {
  repId: number;
  loading: boolean = true;
  error: boolean = false;

  report$: Observable<Report>;
  constructor(
    private _route: ActivatedRoute,
    private _url: UrlService,
    private _store: Store<State>,
    private s: ReportService,
  ) {}

  ngOnInit(): void {
    this._store.dispatch(new ReportUpdate());
    this._route.params.subscribe(param => {
      this.repId = +param.id;
      // console.log(typeof this.repId, this.repId, param.id);
      if (this.repId != param.id) {
        this.error = true;
        this.loading = false;
      } else {
        this.report$ = this._store.pipe(
          select(selectReport(this.repId)),
          something => {
            something.subscribe(value => {
              if (value) {
                this.loading = false;
              }
            });
            return something;
          },
        );
      }
    });
  }
}
