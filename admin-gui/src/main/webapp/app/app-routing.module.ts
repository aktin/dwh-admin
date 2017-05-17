/**
 * Created by Xu on 06.04.2017.
 *
 * Routing module
 */

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }        from './home/home.component';
import { UsersComponent }       from './users/users.component';
import { ReportsComponent }     from './reports/reports.component';
import { PropertiesComponent }  from './properties/properties.component';
import { RestrictedComponent }  from './restricted/restricted.component';

import { UserAuthGuard }        from './users/user-auth.guard';
import { RequestsComponent } from './requests/requests.component';
import { ReportSingleComponent } from './reports/report-single.component';

import _ = require('underscore');
import { UserLoginComponent } from './users/user-login.component';

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
        path: 'users',
        component: UsersComponent,
        canActivate: [UserAuthGuard],
        data : {
            name : 'Benutzerverwaltung',
            roles : [
                'LOGGEDIN',
            ],
        },
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
                path: ':id',
                component: ReportSingleComponent,
            },
        ],
    },
    {
        path: 'restricted',
        component: RestrictedComponent,
        canActivate: [UserAuthGuard],
        data : {
            name : 'restrict',
            roles : [
                'ADMIN',
            ],
        },
    },
    {
        path: 'properties',
        component: PropertiesComponent,
        data : {
            name : 'Konfigurationen',
        },
    },
    {
        path: 'requests',
        component: RequestsComponent,
        data : {
            name : 'Anfragen',
        },
    },
    {
        path: 'status',
        component: RequestsComponent,
        data : {
            name : 'Status',
        },
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
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
