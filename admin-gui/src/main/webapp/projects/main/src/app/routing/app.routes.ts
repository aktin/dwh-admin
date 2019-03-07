import { Routes } from "@angular/router";
import { TestDummyComponent } from "@app/test-dummy/";
import { REPORTS_ROUTES_OBJ } from "@app/reports";
import { APP_ROUTES_NAMES } from "./app.routes.names";
import { ROUTE_REDUCE } from "./route-reduce.function";
import _ from "lodash";
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

export const APP_LAST_ROUTES: Routes = [
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

export function APP_ROUTES_FUSING(...routesArrays): Routes {
  console.log(routesArrays);
  if (routesArrays.length == 0) {
    routesArrays.push([]);
  }
  if (routesArrays[0].length == 0)
    routesArrays[0] = ROUTE_REDUCE(APP_ROUTES_OBJ, APP_ROUTES_NAMES);
  let array: Routes = [];
  routesArrays.forEach(routes => {
    _.each(APP_LAST_ROUTES, dR => _.remove(routes, _.matches(dR)));
    array = array.concat(routes);
  });
  // console.log(array);
  return array.concat(APP_LAST_ROUTES);
}
