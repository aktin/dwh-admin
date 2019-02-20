import { REPORTS_ROUTES_NAMES } from "@app/reports";
import _ from "lodash";

export const APP_ROUTES_NAMES = {
  HOME: { path: "home" },
  REPORT: {
    path: "report",
    children: REPORTS_ROUTES_NAMES
  }
};

export interface AppRouteName {
  path: string;
  children?: any;
}

export function APP_ROUTE_LINK(routes: string[]) {
  let url = "";
  let names_obj = APP_ROUTES_NAMES;
  _.each(routes, r => {
    if (names_obj === undefined || names_obj[r] === undefined) {
      console.log(names_obj, r);
      return false;
    }
    url += "/" + names_obj[r].path;
    names_obj = names_obj[r].children;
  });
  return url;
}

export function APP_ROUTE_ALT_LINK(...routes) {
  return APP_ROUTE_LINK(routes);
}
