import { RouterReducerState } from "@ngrx/router-store";
import { reportState, ReportState } from "../../reports/store";
import { pluginsState, PluginsState } from "@app/store/state/plugins.state";

export interface AppState {
  router?: RouterReducerState;
  // reports: ReportState;
  // plugins: PluginsState;
}

export const appState: AppState = {
  // reports: reportState,
  // plugins: pluginsState,
};

export function getInitialState(): AppState {
  return appState;
}
