
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
import { VisitsComponent }  from './visits/index';
import { RequestsComponent, RequestSingleComponent }     from './requests/index';
import { StudyManagerComponent } from './studyManager/index';
import { StatusComponent }       from './status/index';
import { Permissions } from './users/roles';

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
            permissions : [
                Permissions.READ_REQUESTS,
                Permissions.WRITE_REQUESTS,
            ]
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
        canActivateChild : [UserAuthGuard],
        data : {
            name : 'Berichte',
            roles : [
                'LOGGEDIN',
            ],
            permissions : [
                Permissions.READ_REPORTS,
                Permissions.WRITE_REPORTS
            ]
        },
        children : [
            {
                path : '',
                component : ReportsComponent,
            },
            {
                path: 'new',
                component: ReportNewComponent,
                data: {
                    name: 'newReport',
                    permissions: [
                        Permissions.WRITE_REPORTS 
                    ]
                }
            },
            {
                path: ':id',
                component: ReportSingleComponent,
            },
        ],
    },
    {
        path: 'visits',
        canActivate: [UserAuthGuard],
        component: VisitsComponent,
        data : {
            name : 'Fallsuche',
            roles : [
                'LOGGEDIN',
            ],
            permissions : [
                Permissions.LIST_VISITS,
                Permissions.WRITE_STUDY_MANAGER
            ]
        },
    },
    {
        path: 'studyManager',
        canActivate: [UserAuthGuard],
        component: StudyManagerComponent,
        data: {
            name: 'Studien-Manager',
            permissions: [
                Permissions.READ_STUDY_MANAGER,
                Permissions.WRITE_STUDY_MANAGER
            ]
        }
    },
    {
        path: 'preferences',
        canActivate: [UserAuthGuard],
        component: PreferencesComponent,
        data : {
            name : 'Konfigurationen',
            roles : [
                // 'Admin',
                'LOGGEDIN',
            ],
            permissions : [
                Permissions.CONFIG
            ]
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
                // 'Admin',
                'LOGGEDIN',
            ],
            permissions : [
                Permissions.STATUS
            ]
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
