import { Routes, RouterModule, Route } from "@angular/router";
import _ from "lodash";
import { TestDummyComponent } from "@app/test-dummy/";
import { REPORTS_ROUTES_OBJ } from "@app/reports";
import { APP_ROUTES_NAMES, ROUTE_REDUCE } from "@app/app.routes.names";
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
    return ROUTE_REDUCE(APP_ROUTES_OBJ, APP_ROUTES_NAMES).concat(
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
