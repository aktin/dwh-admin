import { RouterReducerState } from "@ngrx/router-store";
import { reportState, ReportState } from "@app/reports/store";

export interface AppState {
  router?: RouterReducerState;
  reports: ReportState;
}

export const appState: AppState = {
  reports: reportState,
};

export function getInitialState(): AppState {
  return appState;
}
