import { Inject, Injectable, Optional } from "@angular/core";
import _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class UrlService {
  private _routeNames: any = undefined;
  constructor(@Optional() @Inject("ROUTE_NAMES") routeNames: any) {
    if (routeNames) {
      this._routeNames = routeNames;
    } else {
      this._routeNames = undefined;
    }
  }

  updateRouteNames(routeNames: any) {
    this._routeNames = routeNames;
  }

  get routeNames() {
    return this._routeNames;
  }

  link(routes: string[]) {
    let url = "";
    let names = this._routeNames;
    _.each(routes, r => {
      if (names === undefined || names[r] === undefined) {
        return false;
      }
      url += "/" + names[r].path;
      names = names[r].children;
    });

    return url;
  }
}
