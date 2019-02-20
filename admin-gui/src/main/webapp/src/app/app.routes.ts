import { Routes, RouterModule, Route } from "@angular/router";
import _ from "lodash";
import { TestDummyComponent } from "@app/test-dummy/test-dummy.component";
import { REPORTS_ROUTES } from "@app/reports";
import { APP_ROUTES_NAMES } from "@app/app.routes.names";
// https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18

const SOME_ROUTES = {
  HOME: {
    path: "home",
    component: TestDummyComponent,
    data: {
      name: "Start"
    }
  },
  REPORT: {
    path: "report",
    data: {
      name: "Bericht"
    },
    childrenObj: REPORTS_ROUTES
  }
};

function reduceRoute(routes: Routes, breads: string[] = []): Route {
  return _.reduce(
    routes,
    (array, route, key) => {
      if (!route.data) {
        route.data = {};
      }
      route.data["breadcrumbs"] = breads;
      route.data["breadcrumbs"].push(key);
      if (route.childrenObj) {
        route.children = reduceRoute(
          route.childrenObj,
          route.data["breadcrumbs"]
        );
      }
      array.push(route);
      return array;
    },
    []
  );
}

const APP_ROUTES: Routes = [
  {
    path: APP_ROUTES_NAMES.HOME.path,
    component: TestDummyComponent,
    data: {
      name: "Start"
    }
  },
  {
    path: APP_ROUTES_NAMES.REPORT.path,
    data: {
      name: "Bericht"
    },
    children: REPORTS_ROUTES
  }
];

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

export function APP_ROUTES_BREADCRUMBS(routes) {
  _.each(routes, route => {});
}

export function APP_ROUTES_FUSING(...routesArrays) {
  if (routesArrays.length == 0) {
    return APP_ROUTES.concat(APP_LAST_ROUTES);
  }
  let array: Routes = [];
  routesArrays.forEach(routes => {
    _.each(APP_LAST_ROUTES, dR => _.remove(routes, _.matches(dR)));
    array = array.concat(routes);
  });
  console.log(array);
  return array.concat(APP_LAST_ROUTES);
}
