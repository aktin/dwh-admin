/**
 * Created by Xu on 06.04.2017.
 *
 * Base App Component with layout
 */
import { Component, OnInit }    from '@angular/core';
import { Title }                from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import _ = require('underscore');

import { routings }     from './app-routing.module';
import { AuthService }  from './users/index';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    visibility: any = {};


    constructor (private _titleService: Title,
                 private _atuhService: AuthService,
                 private _route: ActivatedRoute,
                 private _router: Router) {};

    ngOnInit(): void {
        let title = 'AKTIN - Adminverwaltung';
        this._titleService.setTitle(title);

        this._router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this._route)
            .map(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                let moreTitle = title;
                if (event['name']) {
                    moreTitle = event['name'] + ' - ' + moreTitle;
                }
                this._titleService.setTitle(moreTitle);
            });

    }


    get routings() {
        _.each(routings, route => {
            this.visibility[route.data['name']] = this._atuhService.userLocalCheckRoles(route.data['roles']);
        });

        return routings;
    }

    get visible () {
        return this.visibility;
    }
}
