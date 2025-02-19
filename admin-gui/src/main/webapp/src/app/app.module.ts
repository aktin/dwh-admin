/**
 * Created by Xu on 06.04.2017.
 *
 * App Module
 *  register components and import additional modules
 */

import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {NgxPaginationModule} from 'ngx-pagination';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HomeComponent, TestComponent} from './home';
import {
    CleanUpAuthService,
    DownloadService,
    DurationDataPipe,
    DurationQueryPipe,
    HttpService,
    LoadingComponent,
    MomentDatePipe,
    OrderByPipe,
    PopUpMessageComponent,
    SafeUrlPipe,
    StorageService,
    UrlService, TemplateVarDirective, NotificationService
} from './helpers';
import {
    AuthService,
    UserAuthGuard,
    UserLoginComponent,
    UserNewComponent,
    UsersComponent,
    UserService,
    UserSingleComponent,
    UserSingleViewComponent
} from './users';
import {
    ReportNewComponent,
    ReportsComponent,
    ReportService,
    ReportSingleComponent,
    ReportSingleViewComponent,
    SuccessReportsPipe
} from './reports';
import {PreferencesComponent, PreferenceService} from './preferences';
import {ImporterComponent, ImporterService} from './importer';
import {PopUpUpdateComponent, UpdaterService} from './updater';
import {VisitsComponent, VisitService, VisitSingleViewComponent} from './visits';
import {
    RequestFilterPipe,
    RequestsComponent,
    RequestService,
    RequestSingleComponent,
    RequestSingleViewComponent,
    RequestStatusBarComponent
} from './requests';
import {PopUpDetailComponent, PopUpNewEntryComponent, StudyManagerComponent, StudyManagerService} from './studyManager';
import {StatusComponent, StatusService} from './status';
import {RestrictedComponent} from './restricted/restricted.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ErrorInterceptor} from './helpers/services/error.interceptor';
import {BearerTokenInterceptor} from './helpers/services/bearer-token.interceptor';
import {SetTimeInterceptor} from './helpers/services/set-time.interceptor';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AngularMyDatePickerModule} from "gramli-angular-mydatepicker";
import {FieldModule} from './helpers/field/field.module';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@NgModule({
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
        PopUpUpdateComponent,
        OrderByPipe,
        SafeUrlPipe,
        DurationDataPipe,
        DurationQueryPipe,
        MomentDatePipe,
        SuccessReportsPipe,
        RequestFilterPipe,
    ],
    bootstrap: [
        AppComponent
    ], imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        // JsonpModule,
        AngularMyDatePickerModule,
        NgxPaginationModule,
        NgbInputDatepicker,
        FieldModule
    ],
    exports: [
        SafeUrlPipe,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: SetTimeInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: 'de-DE'},
        Title,
        UrlService,
        StorageService,
        CleanUpAuthService,
        HttpService,
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
        UpdaterService,
        StatusService,
        NotificationService
    ]
})
export class AppModule {
}
