import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoadPluginsService } from "./services";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, RouterModule],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
        ngModule: CoreModule,
        providers: [LoadPluginsService],
    };
}
}

export { LoadPluginsService } from "./services";
