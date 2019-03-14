import {
  reportEntityState,
  ReportEntityState,
  reportTemplateEntityState,
  ReportTemplateEntityState,
} from "./report.entity.state";

export interface ReportState {
  reports: ReportEntityState;
  reportTemplates: ReportTemplateEntityState;
}
export const reportState: ReportState = {
  reports: reportEntityState,
  reportTemplates: reportTemplateEntityState,
};
