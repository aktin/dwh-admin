import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UrlService, I18nService, DownloadService } from "./services";
import { BreadcrumbComponent } from "./components";
import { OrderByPipe, SafeUrlPipe } from "./pipes";

@NgModule({
  declarations: [BreadcrumbComponent, OrderByPipe, SafeUrlPipe],
  imports: [CommonModule, RouterModule],
  exports: [BreadcrumbComponent, OrderByPipe, SafeUrlPipe],
})
export class DwhAdminUtilsModule {
  constructor() {}

  static forRoot(routeNames: any) {
    return {
      ngModule: DwhAdminUtilsModule,
      providers: [
        { provide: "ROUTE_NAMES", useValue: routeNames },
        UrlService,
        I18nService,
        DownloadService,
      ],
    };
  }
}

/* Services */
export * from "./services";

/* Components */
// export * from "./components";
