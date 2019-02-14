import { ReportsListComponent } from "./reports-list.component";
import { ReportComponent } from "./report.component";

export const REPORTS_ROUTES = [
  { path: "", component: ReportsListComponent },
  { path: "single", component: ReportComponent }
];
