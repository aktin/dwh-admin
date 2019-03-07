import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportComponent } from "./components";
import { SharedModule } from "@app/shared";

const REPORTSCOMPONENTS = [ReportsListComponent, ReportComponent];

@NgModule({
  declarations: REPORTSCOMPONENTS,
  entryComponents: REPORTSCOMPONENTS,
  imports: [CommonModule, SharedModule],
  exports: []
})
export class ReportsModule {}
