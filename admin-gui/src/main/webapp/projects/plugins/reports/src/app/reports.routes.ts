import { ReportComponent } from "./components";
import { ReportsListComponent } from "./components";
import { UserAuthGuard, Permission } from "@aktin/utils";

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
    main: {
        canActivate : [UserAuthGuard],
        canActivateChild : [UserAuthGuard],
        data: {
            roles : [
                'LOGGEDIN',
            ],
            permissions : [
                Permission.READ_REPORTS,
                Permission.WRITE_REPORTS
            ]
        },
    },
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
