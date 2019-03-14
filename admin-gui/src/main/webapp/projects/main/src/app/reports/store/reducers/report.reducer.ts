import { reportState, ReportState } from "../report.state";
import { ReportActions, ReportActionTypes } from "../actions/report.actions";
import { reportEntityAdapter, reportTemplateEntityAdapter } from "../report.entity.state";

export function reportReducers(state = reportState, action: ReportActions): ReportState {
  switch (action.type) {
    case ReportActionTypes.AddReport: {
      return {
        ...state,
        reports: reportEntityAdapter.addOne(action.payload.report, state.reports),
      };
    }
    case ReportActionTypes.LoadReports: {
      return {
        ...state,
        reports: reportEntityAdapter.addAll(action.payload.reports, state.reports),
      };
    }
    case ReportActionTypes.UpdateReportsSuccess: {
      return {
        ...state,
        reports: reportEntityAdapter.addAll(action.payload.reports, state.reports),
      };
    }
    case ReportActionTypes.LoadReportTemplates: {
      return {
        ...state,
        reportTemplates: reportTemplateEntityAdapter.addAll(
          action.payload.reportTemplates,
          state.reportTemplates,
        ),
      };
    }
    default: {
      return state;
    }
  }
}

export const reportSelectors = reportEntityAdapter.getSelectors();
export const reportTemplateSelectors = reportEntityAdapter.getSelectors();
