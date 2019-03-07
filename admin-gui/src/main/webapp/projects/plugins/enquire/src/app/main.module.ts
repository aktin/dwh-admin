import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnquireComponent } from "./enquire.component";
import { PATH, PLUGIN_NAME, ROUTE_NAME, ROUTES, ROUTES_NAMES } from "./meta";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, RouterModule.forChild([])],
  declarations: [EnquireComponent],
  entryComponents: [EnquireComponent],
  providers: [
    {
      provide: "plugins",
      useValue: [
        {
          name: "METADATA",
          routeName: ROUTE_NAME,
          routesNames: ROUTES_NAMES,
          routes: ROUTES,
          pluginName: PLUGIN_NAME,
          path: PATH
        }
      ],
      multi: true
    }
  ]
})
export class MainModule {}
