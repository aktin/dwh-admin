import {ModuleWithProviders, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UrlService, I18nService, DownloadService, LocalStorageService } from "./services";
import { BreadcrumbComponent } from "./components";
import { OrderByPipe, SafeUrlPipe } from "./pipes";
import {AuthModule} from "@lib/auth";

@NgModule({
    declarations: [BreadcrumbComponent, OrderByPipe, SafeUrlPipe],
    imports: [CommonModule, RouterModule, AuthModule],
    exports: [BreadcrumbComponent, OrderByPipe, SafeUrlPipe, AuthModule],
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
            ],
        };
    }
}

/* Services */
export * from "./services";

/* Pipes */
export * from "./pipes";

/* Components */
export * from "./components";
