import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { LoadPluginsService } from "@app/core";
import { take } from "rxjs/operators";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
import { of } from "rxjs/internal/observable/of";

@Injectable({
  providedIn: "root",
})
export class ErrorResolverService implements Resolve<any> {
  constructor(private router: Router, private _plug: LoadPluginsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<any> | Promise<never> {
    if (this._plug.pluginLoading) {
      return this._plug.awaitLoad().then(() => {
        return this.router.navigateByUrl(this.router.getCurrentNavigation().finalUrl);
      });
    }
    return null;
  }
}
