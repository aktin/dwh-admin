/**
 * Created by Xu on 06.04.2017.
 *
 * App Module
 *  register components and import additional modules
 */

import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { LOCALE_ID }            from '@angular/core';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { HomeComponent }        from './home/home.component';
import { UsersComponent }       from './users/users.component';
import { ReportsComponent, SuccessReportsPipe }     from './reports/reports.component';
import { PropertiesComponent }  from './properties/properties.component';
import { RestrictedComponent }  from './restricted/restricted.component';
import { UserLoginComponent }   from './users/user-login.component';
import { LoadingComponent }     from './helpers/loading.component';

import { UserAuthGuard }        from './users/user-auth.guard';
import { UserService }          from './users/user.service';
import { HTTPHandlerService, SafePipe, StorageService, UrlService } from './helpers/helpers.service';
import { HttpInterceptorService } from './helpers/http-interceptor.service';
import { RequestsComponent } from './requests/requests.component';
import { ReportService } from './reports/report.service';
import { OrderBy } from './helpers/orderby';
import { ReportSingleViewComponent } from './reports/report-single-view.component';
import { ReportSingleComponent } from './reports/report-single.component';
import { PopUpMessageComponent } from './helpers/popup-message.component';

@NgModule({
    imports:      [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UsersComponent,
        UserLoginComponent,
        ReportsComponent,
        ReportSingleViewComponent,
        ReportSingleComponent,
        PropertiesComponent,
        RequestsComponent,
        RestrictedComponent,
        LoadingComponent,
        PopUpMessageComponent,
        OrderBy,
        SafePipe,
        SuccessReportsPipe,
    ],
    bootstrap:   [
        AppComponent
    ],
    providers:  [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        UrlService,
        StorageService,
        UserAuthGuard,
        UserService,
        ReportService,
        HttpInterceptorService,
        HTTPHandlerService,
    ]
})
export class AppModule { }

