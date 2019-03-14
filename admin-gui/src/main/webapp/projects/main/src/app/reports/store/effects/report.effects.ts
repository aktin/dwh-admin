import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { ReportService } from "../../report.service";
import { ReportActionTypes } from "../actions/report.actions";
import { switchMap, mergeMap } from "rxjs/operators";

@Injectable()
export class ReportEffects {
  @Effect()
  updateReports$ = this.actions$.pipe(
    ofType(ReportActionTypes.UpdateReports),
    mergeMap(() => {
      console.log("hier in effects");
      return this._report.updateReports();
    }),
  );

  constructor(private actions$: Actions, private _report: ReportService) {}
}
