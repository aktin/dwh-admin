/**
 * Created by Xu on 06.04.2017.
 *
 * App Module
 *  register components and import additional modules
 */

import { NgModule, LOCALE_ID }          from '@angular/core';
import { BrowserModule, Title }         from '@angular/platform-browser';
import { FormsModule }                  from '@angular/forms';
import { HttpModule, JsonpModule }      from '@angular/http';

import { MyDatePickerModule }           from 'mydatepicker';

import { AppRoutingModule }             from './app-routing.module';
import { AppComponent }                 from './app.component';

import { HomeComponent, TestComponent }                                             from './home/index';
import { StorageService, UrlService, HttpInterceptorService, DownloadService, CleanUpAuthService,
            SafeUrlPipe, OrderByPipe,
            PopUpMessageComponent, LoadingComponent }                               from './helpers/index';
import { UsersComponent, UserSingleComponent, UserSingleViewComponent, UserNewComponent, UserService,
            UserLoginComponent, UserAuthGuard, AuthService }                        from './users/index';
import { ReportService, SuccessReportsPipe, ReportSingleViewComponent,
            ReportsComponent, ReportNewComponent, ReportSingleComponent }           from './reports/index';
import { PreferencesComponent, PreferenceService }                                  from './preferences/index';
import { RequestsComponent, RequestSingleViewComponent, RequestSingleComponent, RequestStatusBarComponent,
            RequestFilterPipe, RequestService }                                     from './requests/index';
import { StatusComponent, StatusService }                                           from './status/index';
import { RestrictedComponent }  from './restricted/restricted.component';


@NgModule({
    imports:      [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        MyDatePickerModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        TestComponent,
        UserLoginComponent,
        UsersComponent,
        UserSingleComponent,
        UserSingleViewComponent,
        UserNewComponent,
        ReportsComponent,
        ReportSingleViewComponent,
        ReportSingleComponent,
        ReportNewComponent,
        PreferencesComponent,
        RequestsComponent,
        RequestSingleViewComponent,
        RequestSingleComponent,
        RequestStatusBarComponent,
        StatusComponent,
        RestrictedComponent,
        LoadingComponent,
        PopUpMessageComponent,
        OrderByPipe,
        SafeUrlPipe,
        SuccessReportsPipe,
        RequestFilterPipe,
    ],
    bootstrap:   [
        AppComponent
    ],
    providers:  [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        Title,
        UrlService,
        StorageService,
        CleanUpAuthService,
        HttpInterceptorService,
        DownloadService,
        UserAuthGuard,
        AuthService,
        UserService,
        ReportService,
        RequestService,
        PreferenceService,
        StatusService,
    ]
})
export class AppModule { }

