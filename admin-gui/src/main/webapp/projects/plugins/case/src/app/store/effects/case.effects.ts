import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { CaseService } from "../../case.service";
import { CaseActionTypes, CaseUpdateSuccess, CaseActions } from "../actions/case.actions";
import { map, mergeMap, concatMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class CaseEffects {
  @Effect()
  updateReports$ = this.actions$.pipe(
    ofType(CaseActionTypes.CasesUpdate),
    concatMap(() => this._report.updateCases()),
    concatMap(cases => of(new CaseUpdateSuccess({ cases: cases }))),
  );

  constructor(private actions$: Actions<CaseActions>, private _report: CaseService) {}
}
