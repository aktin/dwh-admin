import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ReportsListComponent } from "./reports-list.component";
import { ReportComponent } from "./report.component";
import { REPORTS_ROUTES } from "./reports.routes";

@NgModule({
  declarations: [ReportsListComponent, ReportComponent],
  imports: [
    // RouterModule.forChild(REPORTS_ROUTES),
    CommonModule
  ]
})
export class ReportsModule {}
