/**
 * Created by Xu on 06.04.2017.
 *
 * Routing module
 */

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }        from './home/home.component';
import { PropertiesComponent }  from './properties/properties.component';
import { RestrictedComponent }  from './restricted/restricted.component';

import { RequestsComponent } from './requests/requests.component';

import { UsersComponent, UserLoginComponent, UserAuthGuard }    from './users/index';
import { ReportsComponent, ReportSingleComponent }              from './reports/index';


import _ = require('underscore');

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
                'ADMIN',
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
        path: 'properties',
        component: PropertiesComponent,
        data : {
            name : 'Konfigurationen',
            roles : [
                'LOGGEDIN',
            ],
        },
    },
    {
        path: 'requests',
        component: RequestsComponent,
        data : {
            name : 'Anfragen',
            roles : [
                'LOGGEDIN',
            ],
        },
    },
    {
        path: 'status',
        component: RequestsComponent,
        data : {
            name : 'Status',
            roles : [
                'LOGGEDIN',
            ],
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
