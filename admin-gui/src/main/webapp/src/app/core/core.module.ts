import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadPluginsService } from "./services/load-plugins.service";

@NgModule({
  declarations: [],
  imports: [CommonModule]
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
