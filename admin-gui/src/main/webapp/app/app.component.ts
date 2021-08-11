/**
 * Created by Xu on 06.04.2017.
 *
 * Base App Component with layout
 */
import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import _ = require('underscore');

import { UpdaterService } from './updater/updater.service';
import { PopUpMessageComponent } from './helpers/popup-message.component';
import { PopUpUpdateComponent } from './updater/popup-update.component';

import { routings } from './app-routing.module';
import { AuthService } from './users/index';
import { HttpInterceptorService } from './helpers/services/http-interceptor.service';
import { Response } from '@angular/http';
import { UrlService } from './helpers/services/url.service';

import $ = require('jquery');
require('semantic-ui');

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    visibility: any = {};
    versionData = '';

    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpConfirmDwhUpdate: PopUpMessageComponent = new PopUpMessageComponent();

    @ViewChild(forwardRef(() => PopUpUpdateComponent))
    popUpUpdateSummary: PopUpUpdateComponent = new PopUpUpdateComponent(this._updaterService);

    constructor(private _titleService: Title,
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _http: HttpInterceptorService,
        private _url: UrlService,
        private _updaterService: UpdaterService,
    ) { };

    ngOnInit(): void {
        let title = 'AKTIN - Adminverwaltung';
        this._titleService.setTitle(title);

        $('.main.menu').visibility({
            type: 'fixed'
        });

        $('.ui.sticky.go2top')
            .sticky({
                context: '.app',
            });

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

        this.showDwhUpdateSummary();
    }

    get version() {
        if (!this.versionData) {
            this._http.debouncedGet('version', '', '', 5000, this._url.parse('version'),
                (res: Response) => { return res.text(); },
                (err: Response) => { return err; })
                .subscribe(
                    val => { if (val) { this.versionData = val; } },
                    error => console.log(error)
                );
        }
        return this.versionData.slice(9);
    }

    get routings() {
        _.each(routings, route => {
            this.visibility[route.data['name']] = this._authService.userLocalCheckPermissions(route.data['permissions']);
            if (route.hasOwnProperty('children')) {
                let children = route.children;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].hasOwnProperty('data') && children[i].data.hasOwnProperty('name')) {
                        this.visibility[children[i].data['name']] = true;
                    }
                }
            }
        });
        return routings;
    }

    get visible() {
        return this.visibility;
    }


    showDwhUpdateSummary() {
        // if user has permission (aka is logged in) show update summary
        // else wait for 750ms and check again
        if (this._updaterService.checkPermission() === true) {
            // show the update summary popup after a new update
            // cookie is deleted prior each update
            // timeout to give UpdaterService time to load variables
            if (!this.getCookie('AKTIN.showUpdateSummary')) {
                var that = this;
                setTimeout(function () {
                    that.openLastUpdateSummary();
                }, 1000);
                this.setCookie('AKTIN.showUpdateSummary', 'false');
            };
        } else {
            var that = this;
            setTimeout(function () {
                that.showDwhUpdateSummary();
            }, 750);
        }
    }

    openUpdatePopup() {
        let buttons = [['Update durchführen', 'green'], ['Abbrechen', 'red']];
        this.popUpConfirmDwhUpdate.setConfirm(buttons);
        this.popUpConfirmDwhUpdate.onTop = true;
        this.popUpConfirmDwhUpdate.setData(true, 'Update des AKTIN DWH', 'Das AKTIN Data Warehouse soll von der Version ' + this._updaterService.version_installed + ' auf die Version ' + this._updaterService.version_candidate + ' aktualisert werden. Diese Aktualisierung wird einige Zeit in Anspruch nehmen. Anschließend wird das Data Warehouse neugestart.',
            (submit: boolean) => {
                if (submit) {
                    if (this._updaterService.executeUpdate()) {
                        this.deleteCookie('AKTIN.showUpdateSummary');
                        this._updaterService.isUpdating = true;
                    }
                }
            }
        );
    }

    openLastUpdateSummary() {
        if (this._updaterService.wasUpdateSuccessful)
            this.openUpdateSuccessPopup();
        else
            this.openUpdateFailedPopup();
    }

    openUpdateFailedPopup() {
        this.popUpUpdateSummary.onTop = true;
        this.popUpUpdateSummary.setData(true, 'Update fehlgeschlagen', 'Etwas ist schiefgelaufen. Die alte DWH-Version wurde wiederhergestellt', 'grey');
    }

    openUpdateSuccessPopup() {
        this.popUpUpdateSummary.onTop = true;
        this.popUpUpdateSummary.setData(true, 'Update erfolgreich', 'Das DWH wurde auf Version ' + this._updaterService.version_installed + ' aktualisiert.', 'green');
    }

    setCookie(name: string, value: string) {
        document.cookie = name + "=" + (value || "") + "; path=/";
    }

    getCookie(name: string) {
        let result = "";
        let cookies = document.cookie.split(';');
        cookies.forEach(function (cookie) {
            if (cookie.includes(name))
                result = cookie.split('=')[1]
        });
        return result;
    }

    deleteCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
