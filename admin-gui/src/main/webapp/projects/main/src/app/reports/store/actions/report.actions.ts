import { Action } from "@ngrx/store";
import { Report } from "../../models/report.interface";
import { ReportTemplate } from "../../models/report-template.interface";
import { Update } from "@ngrx/entity";

export enum ReportActionTypes {
  LoadReports = "[Report] Load Reports",
  UpdateReports = "[Report] Update Reports",
  UpdateReportsSuccess = "[Report] Update Reports Success",
  AddReport = "[Report] Add Report",
  NewReport = "[Report] New Report",
  LoadReportTemplates = "[Report] Load Report Templates",
}

export class LoadReports implements Action {
  readonly type = ReportActionTypes.LoadReports;

  constructor(public payload: { reports: Report[] }) {}
}

export class UpdateReports implements Action {
  readonly type = ReportActionTypes.UpdateReports;
}

export class UpdateReportsSuccess implements Action {
  readonly type = ReportActionTypes.UpdateReportsSuccess;

  constructor(public payload: { reports: Report[] }) {}
}

export class AddReport implements Action {
  readonly type = ReportActionTypes.AddReport;

  constructor(public payload: { report: Report }) {}
}

export class NewReport implements Action {
  readonly type = ReportActionTypes.NewReport;
}

export class LoadReportTemplates implements Action {
  readonly type = ReportActionTypes.LoadReportTemplates;

  constructor(public payload: { reportTemplates: ReportTemplate[] }) {}
}
export type ReportActions =
  | LoadReports
  | UpdateReports
  | UpdateReportsSuccess
  | AddReport
  | NewReport
  | LoadReportTemplates;
