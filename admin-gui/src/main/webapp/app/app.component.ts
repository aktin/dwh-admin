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
import { UserService }  from './users/index';

@Component({
      selector: 'my-app',
      templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
    visibility: any = {};


    constructor(private titleService: Title, private userService: UserService, private route: ActivatedRoute, private router: Router) {

    };

    ngOnInit(): void {
        let title = 'AKTIN - Adminverwaltung';
        this.titleService.setTitle(title);

        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.route)
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
                this.titleService.setTitle(moreTitle);
            });

    }


    get routings() {
        _.each(routings, route => {
            this.visibility[route.data['name']] = this.userService.userLocalCheckRoles(route.data['roles']);
        });

        return routings;
    }

    get visible () {
        return this.visibility;
    }
}
