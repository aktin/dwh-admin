import { REPORTS_ROUTES_NAMES } from "@app/reports";
import _ from "lodash";

export const APP_ROUTES_NAMES = {
  HOME: { path: "home", name: "Start" },
  REPORT: {
    path: "report",
    name: "Bericht",
    children: REPORTS_ROUTES_NAMES
  }
};

export function APP_ROUTE_LINK(routes: string[]) {
  let url = "";
  let names = APP_ROUTES_NAMES;
  _.each(routes, r => {
    if (names === undefined || names[r] === undefined) {
      return false;
    }
    url += "/" + names[r].path;
    names = names[r].children;
  });

  return url;
}
