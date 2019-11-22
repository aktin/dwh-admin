import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CaseComponent } from "./case.component";
import { PATH, PLUGIN_NAME, ROUTE_NAME, ROUTES, ROUTES_NAMES, STATE } from "./meta";
import { StoreModule } from "@ngrx/store";
import { caseReducers } from "./store/reducers";
import { EffectsModule } from "@ngrx/effects";
import { CaseEffects } from "./store";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("cases", caseReducers),
    EffectsModule.forFeature([CaseEffects]),
  ],
  declarations: [CaseComponent],
  entryComponents: [CaseComponent],
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
          path: PATH,
          store: STATE,
        },
      ],
      multi: true,
    },
  ],
})
export class MainModule {}
