import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportViewComponent, ReportComponent } from "./components";
import { SharedModule } from "@app/shared";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ReportEffects, reportReducers } from "@app/reports/store";
import { MatGridListModule } from "@angular/material";

const REPORTSCOMPONENTS = [ReportsListComponent, ReportViewComponent, ReportComponent];

@NgModule({
  declarations: REPORTSCOMPONENTS,
  entryComponents: REPORTSCOMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature("reports", reportReducers),
    EffectsModule.forFeature([ReportEffects]),
    MatGridListModule,
  ],
  exports: [],
})
export class ReportsModule {}
