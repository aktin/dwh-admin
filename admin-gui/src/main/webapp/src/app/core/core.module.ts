import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoadPluginsService } from "./services/load-plugins.service";
import { LoadExternalComponent } from "./services/load-external/load-external.component";

@NgModule({
  declarations: [LoadExternalComponent],
  imports: [CommonModule],
  entryComponents: [LoadExternalComponent],
  exports: [LoadExternalComponent]
  // providers: [LoadPluginsService]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [LoadPluginsService]
    };
  }
}

export { LoadPluginsService } from "./services/load-plugins.service";
