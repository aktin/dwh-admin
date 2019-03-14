import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportComponent } from "./components";
import { SharedModule } from "@app/shared";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { reportReducers } from "./store/reducers/report.reducer";
import { ReportEffects } from "./store/effects/report.effects";

const REPORTSCOMPONENTS = [ReportsListComponent, ReportComponent];

@NgModule({
  declarations: REPORTSCOMPONENTS,
  entryComponents: REPORTSCOMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature("reports", reportReducers),
    EffectsModule.forFeature([ReportEffects]),
  ],
  exports: [],
})
export class ReportsModule {}
