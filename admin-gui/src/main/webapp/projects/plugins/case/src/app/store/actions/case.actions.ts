import { Action } from "@ngrx/store";
import { Case, CaseTemplate } from "../../models";

export enum CaseActionTypes {
  CasesList = "[Case List Page] list all Cases",
  CasesUpdate = "[Case Service] Load Cases from Server",
  CasesUpdated = "[Case API] Update Cases Success",
  CaseCreate = "[Case List Page] Create New Case",
  CaseCreated = "[Case API] Create Case Success", // reload all cases from server
  CaseTemplateList = "[New Case Page] Load All Case Templates",
  CaseTemplateUpdate = "[Case Service] Load Case Templates from Server",
  CaseTemplateUpdated = "[Case API] Update Case Templates Success",
}

export class CasesLoadAll implements Action {
  readonly type = CaseActionTypes.CasesList;

  constructor(public payload: { cases: Case[] }) {}
}

export class CasesUpdate implements Action {
  readonly type = CaseActionTypes.CasesUpdate;
}

export class CaseUpdateSuccess implements Action {
  readonly type = CaseActionTypes.CasesUpdated;

  constructor(public payload: { cases: Case[] }) {}
}
export class CaseNew implements Action {
  readonly type = CaseActionTypes.CaseCreate;
}

export class CaseNewSuccess implements Action {
  readonly type = CaseActionTypes.CaseCreated;

  constructor(public payload: { cases: Case[] }) {}
}

export class CaseTemplatesLoadAll implements Action {
  readonly type = CaseActionTypes.CaseTemplateList;

  constructor(public payload: { caseTemplates: CaseTemplate[] }) {}
}

export class CaseTemplatesUpdateSuccess implements Action {
  readonly type = CaseActionTypes.CaseTemplateUpdated;

  constructor(public payload: { caseTemplates: CaseTemplate[] }) {}
}

export class CaseTemplateUpdateAll implements Action {
  readonly type = CaseActionTypes.CaseTemplateUpdate;
}

export type CaseActions =
    | CasesLoadAll
    | CasesUpdate
    | CaseUpdateSuccess
    | CaseNew
    | CaseNewSuccess
    | CaseTemplatesLoadAll
    | CaseTemplatesUpdateSuccess
    | CaseTemplateUpdateAll;
