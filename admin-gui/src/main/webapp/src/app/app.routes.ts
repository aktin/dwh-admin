import { Routes, RouterModule, Route } from "@angular/router";
import _ from "lodash";
import { TestDummyComponent } from "@app/test-dummy/";
import { REPORTS_ROUTES_OBJ } from "@app/reports";
import { APP_ROUTES_NAMES } from "@app/app.routes.names";
// https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18

export const APP_ROUTES_OBJ = {
  HOME: {
    component: TestDummyComponent
  },
  REPORT: {
    data: {},
    childrenObj: REPORTS_ROUTES_OBJ
  }
};

const APP_LAST_ROUTES: Routes = [
  /*last resort*/
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  }
];

export function APP_ROUTES_FUSING(...routesArrays) {
  if (routesArrays.length == 0) {
    return reduceRoute(APP_ROUTES_OBJ, APP_ROUTES_NAMES).concat(
      APP_LAST_ROUTES
    );
  }
  let array: Routes = [];
  routesArrays.forEach(routes => {
    _.each(APP_LAST_ROUTES, dR => _.remove(routes, _.matches(dR)));
    array = array.concat(routes);
  });
  // console.log(array);
  return array.concat(APP_LAST_ROUTES);
}

function reduceRoute(
  routes,
  routeNames,
  breads: string[] = [],
  url: string = ""
): Routes {
  if (Array.isArray(routes)) return routes;
  return _.reduce(
    routes,
    (array, route, key) => {
      let routeName = routeNames[key];
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
