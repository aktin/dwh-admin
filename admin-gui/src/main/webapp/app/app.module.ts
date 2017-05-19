/**
 * Created by Xu on 06.04.2017.
 *
 * App Module
 *  register components and import additional modules
 */

import { NgModule }             from '@angular/core';
import { BrowserModule, Title }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { LOCALE_ID }            from '@angular/core';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';

import { HomeComponent }                                                            from './home/index';
import { HttpHandlerService, StorageService, UrlService, HttpInterceptorService,
            SafeUrlPipe, OrderByPipe,
            PopUpMessageComponent, LoadingComponent }                               from './helpers/index';
import { UsersComponent, UserLoginComponent, UserAuthGuard, UserService }           from './users/index';
import { ReportService, SuccessReportsPipe,
            ReportsComponent, ReportSingleViewComponent, ReportSingleComponent }    from './reports/index';
import { PreferencesComponent, PreferenceService }                                  from './preferences/index';
import { RequestsComponent }                                                        from './requests/index';
import { RestrictedComponent }  from './restricted/restricted.component';


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
        PreferencesComponent,
        RequestsComponent,
        RestrictedComponent,
        LoadingComponent,
        PopUpMessageComponent,
        OrderByPipe,
        SafeUrlPipe,
        SuccessReportsPipe,
    ],
    bootstrap:   [
        AppComponent
    ],
    providers:  [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        Title,
        UrlService,
        StorageService,
        HttpInterceptorService,
        HttpHandlerService,
        UserAuthGuard,
        UserService,
        ReportService,
        PreferenceService,
    ]
})
export class AppModule { }

