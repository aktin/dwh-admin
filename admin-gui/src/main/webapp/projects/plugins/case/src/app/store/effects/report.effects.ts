import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Report1Service } from "../../report.service";
import { ReportActionTypes, ReportUpdateSuccess, ReportActions } from "../actions/report.actions";
import { map, mergeMap, concatMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ReportEffects {
  @Effect()
  updateReports$ = this.actions$.pipe(
    ofType(ReportActionTypes.ReportsUpdate),
    concatMap(() => this._report.updateReports()),
    concatMap(reports => of(new ReportUpdateSuccess({ reports: reports }))),
  );

  constructor(private actions$: Actions<ReportActions>, private _report: Report1Service) {}
}
