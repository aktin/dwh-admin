import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DwhAdminUtilsModule } from "@aktin/utils";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ReportEffects, STATE } from "./store";
import { reportReducers } from "./store/reducers";
import { PATH, PLUGIN_NAME, ROUTE_NAME } from "./meta";
import { REPORTS_ROUTES_NAMES, REPORTS_ROUTES_OBJ } from "./reports.routes";
import { ReportComponent, ReportsListComponent, ReportViewComponent } from "./components";
import { RouterModule } from "@angular/router";
import { ReportNewComponent } from './components/new/report-new.component';

const REPORTSCOMPONENTS = [ReportsListComponent, ReportViewComponent, ReportComponent];

@NgModule({
  declarations: [REPORTSCOMPONENTS, ReportNewComponent],
  entryComponents: REPORTSCOMPONENTS,
  imports: [
    CommonModule,
    DwhAdminUtilsModule,
    StoreModule.forFeature("reports", reportReducers),
    EffectsModule.forFeature([ReportEffects]),
    RouterModule,
  ],
  providers: [
    {
      provide: "plugins",
      useValue: [
        {
          name: "METADATA",
          routeName: ROUTE_NAME,
          routesNames: REPORTS_ROUTES_NAMES,
          routes: REPORTS_ROUTES_OBJ,
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
