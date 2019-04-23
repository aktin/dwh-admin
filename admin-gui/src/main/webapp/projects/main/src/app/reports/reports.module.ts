import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { DwhAdminUtilsModule } from "@aktin/utils";
import { ReportsListComponent, ReportViewComponent, ReportComponent } from "./components";
import { ReportEffects, reportReducers } from "./store";

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
