import { NgModule } from "@angular/core";
import { DwhAdminUtilsComponent } from "./dwh-admin-utils.component";
import { UrlService } from "./services/url.service";

@NgModule({
  declarations: [DwhAdminUtilsComponent],
  imports: [],
  exports: [DwhAdminUtilsComponent]
})
export class DwhAdminUtilsModule {
  constructor() {}

  static forRoot(routeNames: any) {
    let someModule = {
      ngModule: DwhAdminUtilsModule,
      providers: [{ provide: "ROUTE_NAMES", useValue: routeNames }, UrlService]
    };
    console.log("forroot : ", someModule);
    return someModule;
  }
}

export { UrlService } from "./services/url.service";
