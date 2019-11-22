import { CaseTemplateEntity } from "./caseTemplate";
import { CaseEntity } from "./case";

export interface CaseState {
  cases: CaseEntity.State;
  caseTemplates: CaseTemplateEntity.State;
}

export const reportState: CaseState = {
  cases: CaseEntity.initialState,
  caseTemplates: CaseTemplateEntity.initialState,
};
