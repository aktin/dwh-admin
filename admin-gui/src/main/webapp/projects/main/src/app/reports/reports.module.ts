import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportViewComponent, ReportComponent } from "./components";
import { SharedModule } from "@app/shared";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ReportEffects, reportReducers } from "@app/reports/store";
import { RouterModule } from "@angular/router";
import { I18nService } from "@app/reports/i18n/i18n.service";

const REPORTSCOMPONENTS = [ReportsListComponent, ReportViewComponent, ReportComponent];

@NgModule({
  declarations: REPORTSCOMPONENTS,
  entryComponents: REPORTSCOMPONENTS,
  providers: [I18nService],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature("reports", reportReducers),
    EffectsModule.forFeature([ReportEffects]),
    RouterModule,
  ],
  exports: [],
})
export class ReportsModule {}
