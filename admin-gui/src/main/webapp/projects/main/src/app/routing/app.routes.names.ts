import { REPORTS_ROUTES_NAMES } from "@app/reports";
export const APP_ROUTES_NAMES = {
  HOME: { path: "home", name: "Start" },
  TEST: { path: "test", name: "Testing" },
  REPORT: {
    path: "report",
    name: "Bericht",
    children: REPORTS_ROUTES_NAMES
  }
};