import { Routes } from "@angular/router";
import { TestDummyComponent } from "@app/default/test-dummy/";
import { REPORTS_ROUTES_OBJ } from "@app/reports";
import { ErrorComponent } from "@app/default/error/";
import { HomeComponent } from "@app/default";
// https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18

export const APP_ROUTES_OBJ = {
  HOME: {
    component: HomeComponent
  },
  TEST: {
    component: TestDummyComponent
  },
  REPORT: {
    data: {},
    childrenObj: REPORTS_ROUTES_OBJ
  }
};

export const APP_LAST_ROUTES: Routes = [
  /*last resort*/
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    /*Error 404*/
    path: "**",
    component: ErrorComponent
  }
];
