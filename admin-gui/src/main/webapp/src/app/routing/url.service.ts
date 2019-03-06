import { Injectable } from "@angular/core";
import { APP_ROUTES_NAMES } from "./app.routes.names";
import _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class UrlService {
  constructor() {}

  static link(routes: string[]) {
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
}
