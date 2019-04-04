import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoadExternalComponent } from "./load-external/load-external.component";
import { LoadPluginsService } from "./services";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [LoadExternalComponent, BreadcrumbComponent],
  imports: [CommonModule],
  entryComponents: [LoadExternalComponent],
  exports: [LoadExternalComponent, BreadcrumbComponent],
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [LoadPluginsService],
    };
  }
}

export { LoadPluginsService } from "./services/load-plugins.service";
