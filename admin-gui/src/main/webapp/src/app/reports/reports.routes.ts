import { ReportsListComponent } from "./reports-list.component";
import { ReportComponent } from "./report.component";
import { Routes } from "@angular/router";

export const REPORTS_ROUTES_NAMES = {
  HOME: { path: "" },
  SINGLE: { path: "single" },
  TEST: {
    path: "test",
    children: {
      HOME: {
        path: ""
      },
      TEST: {
        path: "test"
      },
      SINGLE: {
        path: "single"
      }
    }
  }
};

export const REPORTS_ROUTES: Routes = [
  { path: REPORTS_ROUTES_NAMES.HOME.path, component: ReportsListComponent },
  { path: REPORTS_ROUTES_NAMES.SINGLE.path, component: ReportComponent },
  {
    path: REPORTS_ROUTES_NAMES.TEST.path,
    children: [
      {
        path: REPORTS_ROUTES_NAMES.TEST.children.TEST.path,
        component: ReportComponent
      },
      {
        path: REPORTS_ROUTES_NAMES.TEST.children.HOME.path,
        component: ReportComponent
      },
      {
        path: REPORTS_ROUTES_NAMES.TEST.children.SINGLE.path,
        component: ReportsListComponent
      }
    ]
  }
  // { path: ":id", component: RequestSingleComponent }
];
