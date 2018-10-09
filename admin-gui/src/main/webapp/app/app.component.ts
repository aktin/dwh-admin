/**
 * Created by Xu on 06.04.2017.
 *
 * Base App Component with layout
 */
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import _ = require('underscore');

import { routings } from './app-routing.module';
import { AuthService } from './users/index';
import { HttpInterceptorService } from './helpers/services/http-interceptor.service';
import { Response } from '@angular/http';
import { UrlService } from './helpers/services/url.service';
import { Role } from './users/roles';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    visibility: any = {};
    versionData = '';

    constructor (private _titleService: Title,
                 private _authService: AuthService,
                 private _route: ActivatedRoute,
                 private _router: Router,
                 private _http: HttpInterceptorService,
                 private _url: UrlService,
                 ) {};

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

    get version () {
        if (!this.versionData) {
            this._http.debouncedGet('version', '', '', 5000, this._url.parse('version'),
                (res: Response) => { return res.text(); },
                (err: Response) => { return err; } )
                .subscribe(
                    val => { if (val) {this.versionData = val; } },
                    error => console.log(error)
                );
        }
        if (!this.versionData) {
            return 'Bitte einloggen zum Anzeigen.';
        }

        return this.versionData.slice(9);
    }

    get routings() {
        _.each(routings, route => {
            // this.visibility[route.data['name']] = this._authService.userLocalCheckRoles(route.data['roles']);
            this.visibility[route.data['name']] = this._authService.userLocalCheckPermissions(route.data['permissions']);
        });

        return routings;
    }

    get visible () {
        return this.visibility;
    }
}
