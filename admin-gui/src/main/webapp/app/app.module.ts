/**
 * Created by Xu on 06.04.2017.
 *
 * App Module
 *  register components and import additional modules
 */

import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { MyDatePickerModule } from 'mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent, TestComponent } from './home/index';
import { StorageService, UrlService, HttpInterceptorService, DownloadService, CleanUpAuthService,
            SafeUrlPipe, OrderByPipe, DurationDataPipe, DurationQueryPipe, MomentDatePipe,
            PopUpMessageComponent, LoadingComponent } from './helpers/index';
import { UsersComponent, UserSingleComponent, UserSingleViewComponent, UserNewComponent, UserService,
            UserLoginComponent, UserAuthGuard, AuthService } from './users/index';
import { ReportService, SuccessReportsPipe, ReportSingleViewComponent,
            ReportsComponent, ReportNewComponent, ReportSingleComponent } from './reports/index';
import { PreferencesComponent, PreferenceService } from './preferences/index';
import { ImporterComponent, ImporterService } from './importer/index';
import { VisitService, VisitsComponent, VisitSingleViewComponent } from './visits/index';
import { RequestsComponent, RequestSingleViewComponent, RequestSingleComponent, RequestStatusBarComponent,
            RequestFilterPipe, RequestService } from './requests/index';
import { StudyManagerComponent, StudyManagerService, PopUpNewEntryComponent, PopUpDetailComponent } from './studyManager/index';
import { StatusComponent, StatusService } from './status/index';
import { RestrictedComponent } from './restricted/restricted.component';
import { ProgressHttpModule } from 'angular-progress-http';


@NgModule({
    imports:      [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        MyDatePickerModule,
        NgxPaginationModule,
        ProgressHttpModule,
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
        ImporterComponent,
        RequestsComponent,
        RequestSingleViewComponent,
        RequestSingleComponent,
        RequestStatusBarComponent,
        VisitsComponent,
        VisitSingleViewComponent,
        StudyManagerComponent,
        PopUpNewEntryComponent,
        PopUpDetailComponent,
        StatusComponent,
        RestrictedComponent,
        LoadingComponent,
        PopUpMessageComponent,
        OrderByPipe,
        SafeUrlPipe,
        DurationDataPipe,
        DurationQueryPipe,
        MomentDatePipe,
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
        VisitService,
        StudyManagerService,
        PreferenceService,
        ImporterService,
        StatusService,
        // {provide: Window, useValue: window },
    ]
})
export class AppModule { }
