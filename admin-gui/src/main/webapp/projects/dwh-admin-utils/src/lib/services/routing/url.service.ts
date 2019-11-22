import { Inject, Injectable, Optional } from "@angular/core";
import _ from "lodash";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UrlService {
  private _routeNames: any = undefined;
  private token: string;
  private _url_start = "aktin/admin/rest/";

  private _endUrls = {};

  constructor(@Optional() @Inject("ROUTE_NAMES") routeNames: any, private _http: HttpClient) {
    if (routeNames) {
      this._routeNames = routeNames;
    } else {
      this._routeNames = undefined;
    }
  }

  setToken (token) {
    this.token = token;
  }

  generateHeaderOptions (key?: string, value?: string, options?: any): any {
    if (options == null) {
      options = {};
    }
    if (options.headers == null) {
      options.headers = new HttpHeaders();
    }
    if (key) {
      options.headers.append(key, value);
    }
    return options;
  }

  private getRequestOptionArgs(options?: any): any {
    options = this.generateHeaderOptions(null, null, options);
    if (this.token) {
      options.headers.set('Authorization', 'Bearer ' + this.token);
    }
    // options.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    // options.headers.append('Pragma', 'no-cache');
    // options.headers.append('Expires', '0');
    return options;
  }

  get<T>(url: string) {
    return this._http.get<T>(url);
  }

  post<T> (url: string, body: any, options ?: any) {
    return this._http.post<T> (url, body, options);
  }

  getUrl(url_end: string) {
    return this._url_start + url_end;
  }

  parse(url: string, args?: any, iEndUrls?: any): string {
    let endUrl = url;
    if (iEndUrls) {
      endUrl = iEndUrls[url] || url;
    }
    if (endUrl === url) {
      endUrl = this._endUrls[url] || url;
    }
    let keys = endUrl.match(/@\w*@/g);
    if (keys && keys.length >= 0) {
      endUrl = _.reduce(
        keys,
        (memo: string, item: string) => memo.replace(item, args[/\w+/.exec(item)[0]]),
        endUrl,
      );
    }

    return this._url_start + endUrl;
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
