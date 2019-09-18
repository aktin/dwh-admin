import { Routes } from "@angular/router";
import { TestDummyComponent } from "@app/default/test-dummy/";
import { HomeComponent } from "@app/default";
import { ErrorComponent, ErrorResolverService } from "@app/default/";
// https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18

export const APP_ROUTES_OBJ = {
  HOME: {
    component: HomeComponent,
  },
  // TEST: {
  //   component: TestDummyComponent,
  // },
};

export const APP_LAST_ROUTES: Routes = [
  /*last resort*/
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    /*Error 404*/
    path: "**",
    component: ErrorComponent,
    resolve: {
      plugins: ErrorResolverService,
    },
  },
];
