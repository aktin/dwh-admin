import { ReportActions, ReportActionTypes } from "../actions/report.actions";
import { ReportEntity } from "../state";

export function reportsReducer(
  state = ReportEntity.initialState,
  action: ReportActions,
): ReportEntity.State {
  switch (action.type) {
    case ReportActionTypes.ReportUpdateSuccess: {
      return ReportEntity.adapter.addAll(action.payload.reports, state);
    }

    case ReportActionTypes.ReportsList: {
      return ReportEntity.adapter.addAll(action.payload.reports, state);
    }

    default: {
      return state;
    }
  }
}
