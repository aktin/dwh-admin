import { ReportActions, ReportActionTypes } from "../actions/report.actions";
import { ReportTemplateEntity } from "../state";

export function reportTemplatesReducer(
  state = ReportTemplateEntity.initialState,
  action: ReportActions,
): ReportTemplateEntity.State {
  switch (action.type) {
    case ReportActionTypes.ReportTemplatesUpdateSuccess: {
      return ReportTemplateEntity.adapter.addAll(action.payload.reportTemplates, state);
    }

    case ReportActionTypes.TemplateList: {
      return ReportTemplateEntity.adapter.addAll(action.payload.reportTemplates, state);
    }

    default: {
      return state;
    }
  }
}
