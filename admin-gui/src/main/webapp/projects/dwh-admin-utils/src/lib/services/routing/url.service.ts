import { Inject, Injectable, Optional } from "@angular/core";
import _ from "lodash";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UrlService {
  private _routeNames: any = undefined;
  private _url_start = "http://134.106.36.86:8087/aktin/admin/rest/";

  constructor(@Optional() @Inject("ROUTE_NAMES") routeNames: any, private _http: HttpClient) {
    if (routeNames) {
      this._routeNames = routeNames;
    } else {
      this._routeNames = undefined;
    }
  }

  get<T>(url_end: string) {
    return this._http.get<T>(this.getUrl(url_end));
  }

  getUrl(url_end: string) {
    return this._url_start + url_end;
  }

  updateRouteNames(routeNames: any) {
    this._routeNames = routeNames;
  }

  get routeNames() {
    return this._routeNames;
  }

  link(routes: string[], param: object = {}, hash: boolean = false) {
    let url = "";
    let names = this._routeNames;
    _.each(routes, r => {
      if (names === undefined || names[r] === undefined) {
        return false;
      }
      if (names[r].path.startsWith(":")) {
        // parameter
        let paramName = names[r].path.slice(1);
        url += "/" + param[paramName];
      } else {
        url += "/" + names[r].path;
      }
      names = names[r].children;
    });
    if (hash) {
      url = "#/" + url;
    }
    return url;
  }
}
