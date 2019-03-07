import { NgModule } from "@angular/core";
import { UrlService } from "./routing/url.service";

@NgModule({
  declarations: []
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

export { UrlService } from "./routing/url.service";
