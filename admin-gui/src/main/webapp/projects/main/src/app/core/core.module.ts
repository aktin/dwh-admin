import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { LoadExternalComponent } from "./load-external/load-external.component";
import { LoadPluginsService } from "./services";
import { RouterModule } from "@angular/router";
import { ExternalDirective } from './load-external/external.directive';

@NgModule({
  declarations: [LoadExternalComponent, ExternalDirective],
  imports: [CommonModule, RouterModule, HttpClientModule],
  entryComponents: [LoadExternalComponent],
  exports: [LoadExternalComponent, HttpClientModule],
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [LoadPluginsService],
    };
  }
}

export { LoadPluginsService } from "./services";
