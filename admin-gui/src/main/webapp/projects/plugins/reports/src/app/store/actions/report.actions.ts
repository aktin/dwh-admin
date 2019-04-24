import { Action } from "@ngrx/store";
import { Report, ReportTemplate } from "../../models";

export enum ReportActionTypes {
  ReportsList = "[Report List Page] list all Reports",
  ReportsUpdate = "[Report Service] Load Reports from Server",
  ReportsUpdated = "[Report API] Update Reports Success",
  ReportCreate = "[Report List Page] Create New Report",
  ReportCreated = "[Report API] Create Report Success", // reload all reports from server
  TemplateList = "[New Report Page] Load All Report Templates",
  TemplateUpdate = "[Report Service] Load Report Templates from Server",
  TemplateUpdated = "[Report API] Update Report Templates Success",
}

export class ReportsLoadAll implements Action {
  readonly type = ReportActionTypes.ReportsList;

  constructor(public payload: { reports: Report[] }) {}
}

export class ReportUpdate implements Action {
  readonly type = ReportActionTypes.ReportsUpdate;
}

export class ReportUpdateSuccess implements Action {
  readonly type = ReportActionTypes.ReportsUpdated;

  constructor(public payload: { reports: Report[] }) {}
}
export class ReportNew implements Action {
  readonly type = ReportActionTypes.ReportCreate;
}

export class ReportNewSuccess implements Action {
  readonly type = ReportActionTypes.ReportCreated;

  constructor(public payload: { reports: Report[] }) {}
}

export class ReportTemplatesLoadAll implements Action {
  readonly type = ReportActionTypes.TemplateList;

  constructor(public payload: { reportTemplates: ReportTemplate[] }) {}
}

export class ReportTemplatesUpdateSuccess implements Action {
  readonly type = ReportActionTypes.TemplateUpdated;

  constructor(public payload: { reportTemplates: ReportTemplate[] }) {}
}

export class ReportTemplateUpdateAll implements Action {
  readonly type = ReportActionTypes.TemplateUpdate;
}

export type ReportActions =
  | ReportsLoadAll
  | ReportUpdate
  | ReportUpdateSuccess
  | ReportNew
  | ReportNewSuccess
  | ReportTemplatesLoadAll
  | ReportTemplatesUpdateSuccess
  | ReportTemplateUpdateAll;
