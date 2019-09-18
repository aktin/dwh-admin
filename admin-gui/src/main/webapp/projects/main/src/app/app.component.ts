import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { select, Store } from "@ngrx/store";

import { LoadPluginsService, LoadExternalComponent } from "@app/core";
import { State } from "@aktin/utils";
import _ from "lodash";
import { AppRouterModule } from "@app/routing/app-router.module";

@Component({
  selector: "admin-gui-root",
  providers: [],
  templateUrl: "./app.component.html",
  styleUrls: [],
})
export class AppComponent implements OnInit {
  visibility: any = {};
  title = "aktin-dwh-admin-gui";
  routes = [];

  constructor(
    private _titleService: Title,
    private _router: AppRouterModule,
    private _route: ActivatedRoute,
    private _plugins: LoadPluginsService,
    private _store: Store<State>,
  ) {}

  ngOnInit(): void {
    let title = "AKTIN - Adminverwaltung";
    this._titleService.setTitle(title);

    this._plugins.loadConfigFile(LoadExternalComponent).then(() => {
      // get plugin routes
      let curRoutes = this._router.addRoutes2Router(this._plugins.routes, this._plugins.routeNames);

      this.setRoutes(curRoutes);

      // get plugin states - dont need it?
    });
  }

  setRoutes(routes) {
    this.routes = _.reduce(
      routes,
      (memo, route) => {
        if (route.data && route.data["name"]) {
          memo.push(route);
        }
        return memo;
      },
      [],
    );
  }

  get routings() {
    return this.routes;
  }

  login() {
    console.log("login?");
  }
}
