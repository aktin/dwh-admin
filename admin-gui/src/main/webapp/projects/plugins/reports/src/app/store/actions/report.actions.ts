import { Action } from "@ngrx/store";
import { Report, ReportTemplate } from "../../models";

export enum ReportActionTypes {
  ReportsUpdate = "[Report List Page | Report Service] Load Reports from Server",
  ReportUpdateSuccess = "[Report API] Update Reports Success",
  ReportCreate = "[Report List Page] Create New Report",
  ReportCreateSuccess = "[Report API] Create Report Success", // reload all reports from server
  TemplateUpdate = "[New Report Page | Report Service] Load Report Templates from Server",
  TemplatesUpdateSuccess = "[Report API] Update Report Templates Success",
}

export class ReportUpdate implements Action {
  readonly type = ReportActionTypes.ReportsUpdate;
}

export class ReportUpdateSuccess implements Action {
  readonly type = ReportActionTypes.ReportUpdateSuccess;

  constructor(public payload: { reports: Report[] }) {}
}
export class ReportCreate implements Action {
  readonly type = ReportActionTypes.ReportCreate;
}

export class ReportCreateSuccess implements Action {
  readonly type = ReportActionTypes.ReportCreateSuccess;

  constructor(public payload: { reports: Report[] }) {}
}

export class TemplatesUpdateSuccess implements Action {
  readonly type = ReportActionTypes.TemplatesUpdateSuccess;

  constructor(public payload: { reportTemplates: ReportTemplate[] }) {}
}

export class TemplateUpdate implements Action {
  readonly type = ReportActionTypes.TemplateUpdate;
}

export type ReportActions =
  | ReportUpdate
  | ReportUpdateSuccess
  | ReportCreate
  | ReportCreateSuccess
  | TemplatesUpdateSuccess
  | TemplateUpdate;
