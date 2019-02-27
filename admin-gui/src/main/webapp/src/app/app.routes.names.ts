import { REPORTS_ROUTES_NAMES } from "@app/reports";
import _ from "lodash";
import { Routes } from "@angular/router";

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

export function ROUTE_REDUCE(
  routes,
  routeNames = {},
  breads: string[] = [],
  url: string = ""
): Routes {
  return reduceRoute(routes, routeNames, breads, url);
}

function reduceRoute(
  routes,
  routeNames = {},
  breads: string[] = [],
  url: string = ""
): Routes {
  console.log(routes);
  if (Array.isArray(routes)) return routes;
  return _.reduce(
    routes,
    (array, route, key) => {
      let routeName = routeNames ? routeNames[key] : {};
      if (!routeName) {
        routeName = { path: key, name: key };
      }
      if (!route.path) route.path = routeName.path;
      if (!route.data) {
        route.data = {};
      }
      if (!route.data["name"]) route.data["name"] = routeName.name;
      route.data["breadcrumbs"] = breads.concat(key);
      route.data["fullPath"] = url + "/" + route.path;

      if (route.childrenObj)
        route.children = reduceRoute(
          route.childrenObj,
          routeName.children,
          route.data["breadcrumbs"],
          route.data["fullPath"]
        );
      array.push(route);
      return array;
    },
    []
  );
}
