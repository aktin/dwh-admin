import { ReportComponent } from "./components";
import { ReportsListComponent } from "./components";

export const REPORTS_ROUTES_NAMES = {
  HOME: { path: "" },
  /*SINGLE: {
    path: "single",
  },*/
  SINGLE: {
    path: ":id",
  },
  TEST: {
    path: "test",
    children: {
      HOME: {
        path: "",
      },
      TEST: {
        path: "test",
      },
      SINGLE: { path: "single" },
    },
  },
};

export const REPORTS_ROUTES_OBJ = {
  HOME: {
    component: ReportsListComponent,
  },
  SINGLE: {
    component: ReportComponent,
  },
  TEST: {
    childrenObj: {
      HOME: {
        component: ReportComponent,
      },
      TEST: {
        component: ReportComponent,
      },
      SINGLE: {
        component: ReportsListComponent,
      },
    },
  },
  // { path: ":id", component: RequestSingleComponent }
};