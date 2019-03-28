import { ReportEntity, ReportTemplateEntity, ReportState } from "../state";
import { createFeatureSelector, createSelector } from "@ngrx/store";
// Appstate -> ReportState
export const selectReportState = createFeatureSelector<ReportState>("reports");

// ReportState -> ReportEntity
export const getReportsEntity = createSelector(
  selectReportState,
  (state: ReportState) => state.reports,
);
export const getReportsAsArray = createSelector(
  getReportsEntity,
  ReportEntity.selectAll,
);
export const getReportsCount = createSelector(
  getReportsEntity,
  ReportEntity.selectTotal,
);

export const getSelectedReportId = (state: ReportEntity.State) => state.selectedId;
export const getSelectedTemplateId = (state: ReportTemplateEntity.State) => state.selectedId;
export const selectCurrentReportId = createSelector(
  getReportsEntity,
  getSelectedReportId,
);

// ReportState -> ReporttemplateEntity
export const getReportTemplatesEntity = createSelector(
  selectReportState,
  (state: ReportState) => state.reportTemplates,
);
