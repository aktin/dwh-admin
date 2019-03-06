import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoadExternalComponent } from "./load-external/load-external.component";
import { LoadPluginsService, LinkerService } from "./services";

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
      providers: [LoadPluginsService, LinkerService]
    };
  }
}

export { LoadPluginsService } from "./services/load-plugins.service";
export { LinkerService } from "./services/linker.service";
