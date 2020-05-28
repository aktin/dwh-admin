import {ModuleWithProviders, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UrlService, I18nService, DownloadService, LocalStorageService } from "./services";
import { BreadcrumbComponent } from "./components";
import { OrderByPipe, SafeUrlPipe } from "./pipes";

@NgModule({
    declarations: [BreadcrumbComponent,
            OrderByPipe, SafeUrlPipe
    ],
    imports: [CommonModule, RouterModule],
    exports: [BreadcrumbComponent, OrderByPipe, SafeUrlPipe]
})
export class DwhAdminUtilsModule {
    constructor() {}
    
    static forRoot(routeNames: any): ModuleWithProviders<DwhAdminUtilsModule> {
        return {
            ngModule: DwhAdminUtilsModule,
            providers: [
                { provide: "ROUTE_NAMES", useValue: routeNames },
                UrlService,
                I18nService,
                DownloadService,
                LocalStorageService
            ]
        };
    }
}

