import { CaseComponent } from "./case.component";

export const PLUGIN_NAME = "Case";
export const PATH = "case";
export const ROUTE_NAME = "CASE";

export const ROUTES_NAMES = {
  HOME: { path: "" },
  SUB: { path: "sub" },
};

export const ROUTES = {
  HOME: {
    component: CaseComponent,
  },
  SUB: {
    component: CaseComponent,
  },
  DEFAULT: {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
};
export const STATE = {
  state: {},
  initial: {},
};
