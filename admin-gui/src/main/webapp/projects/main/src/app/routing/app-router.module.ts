import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { APP_LAST_ROUTES, APP_ROUTES_OBJ } from "./app.routes";
import { APP_ROUTES_NAMES } from "./app.routes.names";
import { ROUTE_REDUCE } from "./route-reduce.function";
import _ from "lodash";
import { DwhAdminUtilsModule, UrlService } from "dwh-utils";

@NgModule({
  imports: [
    DwhAdminUtilsModule.forRoot(APP_ROUTES_NAMES),
    RouterModule.forRoot(APP_ROUTES_FUSING(), {
      useHash: true
    })
  ],
  exports: [DwhAdminUtilsModule, RouterModule]
})
export class AppRouterModule {
  constructor(private _router: Router, private _url: UrlService) {}

  /**
   *
   * @param addRoutes
   * @returns the new Router Routes
   */
  addRoutes2Router(addRoutes: Routes): Routes {
    let curRoutes = this._router.config;
    curRoutes = APP_ROUTES_FUSING(curRoutes, addRoutes);
    this._router.resetConfig(curRoutes);
    this._url.updateRouteNames(APP_ROUTES_NAMES);
    return curRoutes;
  }
}

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