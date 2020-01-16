import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { ReportService } from "../../services";
import { ReportActionTypes, ReportActions } from "../actions/report.actions";
import { map, mergeMap, concatMap } from "rxjs/operators";
import {EMPTY, of} from "rxjs";
import {catchError} from "rxjs/internal/operators/catchError";

@Injectable()
export class ReportEffects {
  @Effect()
  updateReports$ = this.actions$.pipe(
    ofType(ReportActionTypes.ReportsUpdate),
    // concatMap(() => this._report.updateReports()),
    // concatMap(reports => of(new ReportUpdateSuccess({ reports: reports }))),
    concatMap(() => this._report.updateReports()
      .pipe(
        map(
          reports => ({type: ReportActionTypes.ReportUpdateSuccess, payload: {reports: reports}})
        ),
        catchError(() => EMPTY)
      ),
    )
  );

  constructor(private actions$: Actions<ReportActions>, private _report: ReportService) {}
}
