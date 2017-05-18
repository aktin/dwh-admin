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
import { PropertiesComponent }  from './properties/properties.component';
import { RestrictedComponent }  from './restricted/restricted.component';
import { RequestsComponent }    from './requests/requests.component';

import { HTTPHandlerService, StorageService, UrlService, HttpInterceptorService,
            SafePipe, SuccessReportsPipe, OrderBy,
            PopUpMessageComponent, LoadingComponent }                               from './helpers/index';
import { UsersComponent, UserLoginComponent, UserAuthGuard, UserService }           from './users/index';


import { ReportService,
            ReportsComponent, ReportSingleViewComponent, ReportSingleComponent }    from './reports/index';


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

