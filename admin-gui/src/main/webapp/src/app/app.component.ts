import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Route, Routes } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { APP_ROUTES_FUSING } from "@app/app.routes";
import { TestDummyComponent } from "@app/test-dummy/test-dummy.component";

import { LoadPluginsService, LoadExternalComponent } from "@app/core";
import _ from "lodash";

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
    private _plugins: LoadPluginsService
  ) {}

  ngOnInit(): void {
    let title = "AKTIN - Adminverwaltung";
    this._titleService.setTitle(title);
    let someRoutes: Routes = [
      {
        path: "test",
        component: TestDummyComponent,
        data: {
          name: "Blub"
        }
      }
    ];

    this._plugins.loadConfigFile(LoadExternalComponent).then(() => {
      let curRoutes = this._router.config;
      curRoutes = APP_ROUTES_FUSING(
        // @ts-ignore
        curRoutes,
        // @ts-ignore
        someRoutes,
        // @ts-ignore
        this._plugins.routes
      );
      this._router.resetConfig(curRoutes);
    });
  }

  get routings() {
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
  /*export const appRoutings = _.reduce(
  routes,
  (list, route) => {
    if (route.data && route.data["name"]) {
      list.push(route);
    }
    return list;
  },
  []
);*/
}
