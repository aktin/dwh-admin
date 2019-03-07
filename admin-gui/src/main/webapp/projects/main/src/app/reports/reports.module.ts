import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsListComponent, ReportComponent } from "./components";
import { SharedModule } from "@app/shared";

@NgModule({
  declarations: [ReportsListComponent, ReportComponent],
  imports: [CommonModule, SharedModule],
  exports: [],
  entryComponents: [ReportsListComponent, ReportComponent]
})
export class ReportsModule {}
