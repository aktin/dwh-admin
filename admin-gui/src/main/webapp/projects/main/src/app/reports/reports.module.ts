import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent } from "./reports-list.component";
import { ReportComponent } from "./report.component";

@NgModule({
  declarations: [ReportsListComponent, ReportComponent],
  imports: [CommonModule],
  exports: []
})
export class ReportsModule {}
