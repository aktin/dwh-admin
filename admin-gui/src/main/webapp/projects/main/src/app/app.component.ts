import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { APP_ROUTES_FUSING } from "@app/routing/app.routes";

import { LoadPluginsService, LoadExternalComponent } from "@app/core";
import _ from "lodash";
import { UrlService } from "@app/core";

@Component({
  selector: "admin-gui-root",
  providers: [],
  templateUrl: "./app.component.html",
  styles: []
})
export class AppComponent implements OnInit {
  visibility: any = {};
  title = "aktin-dwh-admin-gui";

  constructor(
    private _titleService: Title,
    private _router: Router,
    private _route: ActivatedRoute,
    private _plugins: LoadPluginsService,
    private _url: UrlService
  ) {}

  ngOnInit(): void {
    let title = "AKTIN - Adminverwaltung";
    this._titleService.setTitle(title);

    this._plugins.loadConfigFile(LoadExternalComponent).then(() => {
      let curRoutes = this._router.config;

      curRoutes = APP_ROUTES_FUSING(
        // @ts-ignore
        curRoutes,
        // @ts-ignore
        this._plugins.routes
      );
      this._router.resetConfig(curRoutes);
      console.log(this._router.config);
    });
  }

  get routings() {
    console.log(this._url.link(["REPORT", "SINGLE"]));

    let routs = _.reduce(
      this._router.config,
      (memo, route) => {
        if (route.data && route.data["name"]) {
          memo.push(route);
        }
        return memo;
      },
      []
    );

    return routs;
  }
}
