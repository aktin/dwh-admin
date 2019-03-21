import { ActionReducerMap } from "@ngrx/store";
import { ReportState } from "../state/report.state";
import { reportsReducer } from "./report.reducer";
import { reportTemplatesReducer } from "./report-template.reducer";

export const reportReducers: ActionReducerMap<ReportState> = {
  reports: reportsReducer,
  reportTemplates: reportTemplatesReducer,
};
