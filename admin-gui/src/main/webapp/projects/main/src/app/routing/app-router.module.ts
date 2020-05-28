import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { APP_LAST_ROUTES, APP_ROUTES_OBJ } from "./app.routes";
import { APP_ROUTES_NAMES, ROUTE_REDUCE } from "./names";
import _ from "lodash";
import { DwhAdminUtilsModule, UrlService } from "@aktin/utils";
import { environment } from "@env/environment.prod";

let routes_in_module = APP_ROUTES_FUSING();
@NgModule({
  imports: [
    DwhAdminUtilsModule.forRoot(APP_ROUTES_NAMES),
    RouterModule.forRoot([], {
      enableTracing: !environment.production, // <-- debugging purposes only
      useHash: true,
    }),
  ],
  exports: [DwhAdminUtilsModule, RouterModule],
})
export class AppRouterModule {
  constructor(private _router: Router, private _url: UrlService) {}

  /**
   * updates the urlservice with the new routing names, providing updated links
   * @returns the new Router Routes
   */
  addRoutes2Router(addRoutes: Routes, routeNameObj?): Routes {
    let curRoutes = this.getRoutes();
    curRoutes = APP_ROUTES_FUSING(curRoutes, addRoutes);
    this.updateRoutes(curRoutes, _.merge({}, routeNameObj, APP_ROUTES_NAMES));
    return curRoutes;
  }

  updateRoutes(routes: Routes, routeNameObj) {
    this._router.resetConfig(routes);
    this._url.updateRouteNames(routeNameObj);
  }
  getRoutes(): Routes {
    return this._router.config;
  }
}

export function APP_ROUTES_FUSING(...routesArrays): Routes {
  console.log(routesArrays);
  if (routesArrays.length == 0) {
    routesArrays.push([]);
  }
  if (routesArrays[0].length == 0) {
    console.log(APP_ROUTES_NAMES, APP_ROUTES_OBJ);
    routesArrays[0] = ROUTE_REDUCE(APP_ROUTES_OBJ, APP_ROUTES_NAMES);
  }
  let array: Routes = [];
  routesArrays.forEach(routes => {
    _.each(APP_LAST_ROUTES, dR => _.remove(routes, _.matches(dR)));
    array = array.concat(routes);
  });
  // console.log(array);
  return array.concat(APP_LAST_ROUTES);
}
