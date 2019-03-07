import { Router, Routes } from "@angular/router";
import { APP_ROUTES_FUSING } from "@app/routing/app.routes";

export class AppRouter {
  constructor(private _router: Router) {}

  updateRoutes(newRoutes: Routes) {
    this._router.resetConfig(newRoutes);
  }

  /**
   * add additional Routes to the current ones
   */
  composeRoutes(addRoutes: Routes): Routes {
    let curRoutes = this._router.config;
    curRoutes = APP_ROUTES_FUSING(
      // @ts-ignore
      curRoutes,
      // @ts-ignore
      this._plugins.routes
    );
    console.log(this._router.config);

    return curRoutes;
  }
}
