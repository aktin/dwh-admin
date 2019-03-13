import { EnquireComponent } from "./enquire.component";

export const PLUGIN_NAME = "ENQuIRE";
export const PATH = "enquire";
export const ROUTE_NAME = "ENQUIRE";

export const ROUTES_NAMES = {
  HOME: { path: "" },
  SUB: { path: "sub" }
};

export const ROUTES = {
  HOME: {
    component: EnquireComponent
  },
  SUB: {
    component: EnquireComponent
  },
  DEFAULT: {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
};
