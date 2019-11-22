import { ActionReducerMap } from "@ngrx/store";
import { CaseState } from "../state";
import { caseReducer } from "./case.reducer";
import { caseTemplatesReducer } from "./case-template.reducer";

export const caseReducers: ActionReducerMap<CaseState> = {
  cases: caseReducer,
  caseTemplates: caseTemplatesReducer,
};
