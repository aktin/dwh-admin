import { NgModule } from "@angular/core";
import { UrlService } from "./services/url.service";

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class DwhAdminUtilsModule {
  constructor() {}

  static forRoot(routeNames: any) {
    return {
      ngModule: DwhAdminUtilsModule,
      providers: [{ provide: "ROUTE_NAMES", useValue: routeNames }, UrlService]
    };
  }
}

export { UrlService } from "./services/url.service";
