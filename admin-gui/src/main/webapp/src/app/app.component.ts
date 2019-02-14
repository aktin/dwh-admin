import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Route, Routes } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { appRoutings } from "@app/app.routes";
import { LoadPluginsService } from "@app/core";
import { TestDummyComponent } from "@app/test-dummy/test-dummy.component";
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
    let curRoutes = this._router.config;
    let someRoutes: Route[] = [
      {
        path: "test",
        component: TestDummyComponent,
        data: {
          name: "BLub"
        }
      }
    ];

    this._plugins.loadConfigFile().then(() => {
      this._router.resetConfig(
        _.concat(curRoutes, someRoutes, this._plugins.routes)
      );
      console.log(this._router.config);
    });
  }

  get routings() {
    return this._router.config;
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
