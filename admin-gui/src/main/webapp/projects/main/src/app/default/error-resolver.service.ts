import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { LoadPluginsService } from "@app/core";

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
      console.log("waiting for external plugins");
      return this._plug.awaitLoad().then(() => {
        console.log("external Plugins loaded, reload router");
        return this.router.navigateByUrl(this.router.getCurrentNavigation().finalUrl);
      });
    }
    return null;
  }
}
