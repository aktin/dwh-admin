
/**
 * Created by Xu on 06.04.2017.
 *
 * Routing module
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent, TestComponent} from './home';
import {Permission, UserAuthGuard, UserLoginComponent} from './users';
import {ReportNewComponent, ReportsComponent, ReportSingleComponent} from './reports';
import {PreferencesComponent} from './preferences';
import {ImporterComponent} from './importer';
import {RequestsComponent, RequestSingleComponent} from './requests';
import {StudyManagerComponent} from './studyManager';
import {StatusComponent} from './status';
import {PatientListComponent} from "./study-manager/patient-list/patient-list.component";
import {VisitsComponent} from './visits';

const routes: Routes = [// array of routes
  {
    path: 'home',
    component: HomeComponent,
    data: {
      name: 'Start',
    },
  },
  {
    path: 'login',
    component: UserLoginComponent,
  },
  {
    path: 'request',
    canActivate: [UserAuthGuard],
    data: {
      name: 'Anfragen',
      roles: [
        'LOGGEDIN',
      ],
      permissions: [
        Permission.READ_REQUESTS,
        Permission.WRITE_REQUESTS,
      ]
    },
    children: [
      {
        path: '',
        component: RequestsComponent,
      },
      {
        path: ':id',
        component: RequestSingleComponent,
      },
    ],
  },
  {
    path: 'report',
    canActivate: [UserAuthGuard],
    canActivateChild: [UserAuthGuard],
    data: {
      name: 'Berichte',
      roles: [
        'LOGGEDIN',
      ],
      permissions: [
        Permission.READ_REPORTS,
        Permission.WRITE_REPORTS
      ]
    },
    children: [
      {
        path: '',
        component: ReportsComponent,
      },
      {
        path: 'new',
        component: ReportNewComponent,
        data: {
          name: 'newReport',
          permissions: [
            Permission.WRITE_REPORTS
          ]
        }
      },
      {
        path: ':id',
        component: ReportSingleComponent,
      },
    ],
  },
  // {
  //     path: 'visits',
  //     canActivate: [UserAuthGuard],
  //     component: VisitsComponent,
  //     data : {
  //         name : 'Fallsuche',
  //         roles : [
  //             'LOGGEDIN',
  //         ],
  //     },
  // },
  {
    path: 'consentManager',
    canActivate: [UserAuthGuard],
    component: PatientListComponent,
    data: {
      name: 'Studien-Manager',
      permissions: [
        Permission.READ_STUDYMANAGER,
        Permission.WRITE_STUDYMANAGER
      ]
    }
  },
  {
    path: 'importer',
    canActivate: [UserAuthGuard],
    component: ImporterComponent,
    data: {
      name: 'Daten-Import',
      permissions: [
        Permission.READ_P21,
        Permission.WRITE_P21
      ]
    },
  },
  {
    path: 'preferences',
    canActivate: [UserAuthGuard],
    component: PreferencesComponent,
    data: {
      name: 'Konfigurationen',
      roles: [
        // 'Admin',
        'LOGGEDIN',
      ],
      permissions: [
        Permission.CONFIG
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
    data: {
      name: 'Status',
      roles: [
        // 'Admin',
        'LOGGEDIN',
      ],
      permissions: [
        Permission.STATUS
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

export const routings = routes.reduce((memo, route) => {
  if (route.data && route.data['name']) {
    memo.push(route);
  }
  return memo;
}, <Routes>[]);

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
