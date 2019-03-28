import { ReportTemplateEntity } from "./reportTemplate";
import { ReportEntity } from "./report";

export interface ReportState {
  reports: ReportEntity.State;
  reportTemplates: ReportTemplateEntity.State;
}

export const reportState: ReportState = {
  reports: ReportEntity.initialState,
  reportTemplates: ReportTemplateEntity.initialState,
};
