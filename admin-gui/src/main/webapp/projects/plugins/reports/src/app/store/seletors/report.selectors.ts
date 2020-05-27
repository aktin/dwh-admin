import { ReportEntity, ReportTemplateEntity, ReportState } from "../state";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Report } from "../../models";
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

export const getReportsEntities = createSelector(
  getReportsEntity,
  ReportEntity.selectEntities,
);

export const getSelectedReportId = (state: ReportEntity.State) => state.selectedId;
export const getSelectedTemplateId = (state: ReportTemplateEntity.State) => state.selectedId;
export const selectCurrentReportId = createSelector(
  getReportsEntity,
  getSelectedReportId,
);

export const selectCurrentReport = createSelector(
  getReportsEntities,
  getSelectedReportId,
  (reports, reportId: number) => reports[reportId],
);

export const selectReport = (id: number) =>
  createSelector(
    getReportsEntities,
    reports => reports[id],
  );

// ReportState -> ReporttemplateEntity
export const getReportTemplatesEntity = createSelector(
  selectReportState,
  (state: ReportState) => state.reportTemplates,
);
export const getReportTemplatesAsArray = createSelector(
    getReportTemplatesEntity,
    ReportTemplateEntity.selectAll,
);
