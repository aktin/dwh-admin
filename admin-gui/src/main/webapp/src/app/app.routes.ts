import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoadPluginsService } from "@app/core";
import _ from "lodash";
import { TestDummyComponent } from "@app/test-dummy/test-dummy.component";
// https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: TestDummyComponent,
    data: {
      name: "Start"
    }
  }
];
export const appRoutings = _.reduce(
  APP_ROUTES,
  (list, route) => {
    if (route.data && route.data["name"]) {
      list.push(route);
    }
    return list;
  },
  []
);
