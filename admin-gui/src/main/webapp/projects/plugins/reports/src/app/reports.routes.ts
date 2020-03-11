import { ReportsListComponent, ReportComponent, ReportNewComponent } from "./components";
import { UserAuthGuard, Permission } from "@aktin/utils";

export const REPORTS_ROUTES_NAMES = {
    HOME: { path: "" },
    NEW: {
        path: "new",
    },
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
    NEW: {
        component: ReportNewComponent,
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
