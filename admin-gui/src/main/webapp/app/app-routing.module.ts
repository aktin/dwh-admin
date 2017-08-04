/**
 * Created by Xu on 06.04.2017.
 *
 * Routing module
 */

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import _ = require('underscore');

import { HomeComponent, TestComponent }     from './home/index';
import { UsersComponent, UserSingleComponent, UserNewComponent,
        UserLoginComponent, UserAuthGuard } from './users/index';
import { ReportsComponent, ReportSingleComponent, ReportNewComponent } from './reports/index';
import { PreferencesComponent }  from './preferences/index';
import { RequestsComponent, RequestSingleComponent }     from './requests/index';
import { StatusComponent }       from './status/index';

const routes: Routes = [// array of routes
    {
        path: 'home',
        component: HomeComponent,
        data : {
            name : 'Start',
        },
    },
    {
        path: 'login',
        component: UserLoginComponent,
    },
    {
        path: 'request',
        canActivate: [UserAuthGuard],
        data : {
            name : 'Anfragen',
            roles : [
                'LOGGEDIN',
            ],
        },
        children : [
            {
                path : '',
                component : RequestsComponent,
            },
            {
                path: ':id',
                component: RequestSingleComponent,
            },
        ],
    },
    {
        path : 'report',
        canActivate : [UserAuthGuard],
        data : {
            name : 'Berichte',
            roles : [
                'LOGGEDIN',
            ],
        },
        children : [
            {
                path : '',
                component : ReportsComponent,
            },
            {
                path: 'new',
                component: ReportNewComponent,
            },
            {
                path: ':id',
                component: ReportSingleComponent,
            },
        ],
    },
    {
        path: 'preferences',
        canActivate: [UserAuthGuard],
        component: PreferencesComponent,
        data : {
            name : 'Konfigurationen',
            roles : [
                'LOGGEDIN',
            ],
        },
    },
    /*{
        path: 'users',
        canActivate: [UserAuthGuard],
        data : {
            name : 'Benutzerverwaltung',
            roles : [
                'ADMIN',
            ],
        },
        children : [
            {
                path : '',
                component : UsersComponent,
            },
            {
                path: 'new',
                component: UserNewComponent,
            },
            {
                path: ':username',
                component: UserSingleComponent,
            },
        ],
    },*/
    {
        path: 'status',
        canActivate: [UserAuthGuard],
        component: StatusComponent,
        data : {
            name : 'Status',
            roles : [
                'LOGGEDIN',
            ],
        },
    },
    {
        path: 'test',
        component: TestComponent,
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];

export const routings = _.reduce(routes, (memo, route) => {
        if (route.data && route.data['name']) {
            memo.push(route);
        }
        return memo;
    }, []);

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
