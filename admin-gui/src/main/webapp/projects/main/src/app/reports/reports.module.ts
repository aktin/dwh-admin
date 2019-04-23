import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportViewComponent, ReportComponent } from "./components";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ReportEffects, reportReducers } from "@app/reports/store";
import { DwhAdminUtilsModule } from "@aktin/utils";
import { RouterModule } from "@angular/router";

const REPORTSCOMPONENTS = [ReportsListComponent, ReportViewComponent, ReportComponent];

@NgModule({
  declarations: [REPORTSCOMPONENTS],
  entryComponents: REPORTSCOMPONENTS,
  providers: [],
  imports: [
    CommonModule,
    DwhAdminUtilsModule,
    StoreModule.forFeature("reports", reportReducers),
    EffectsModule.forFeature([ReportEffects]),
    RouterModule,
  ],
  exports: [],
})
export class ReportsModule {}
