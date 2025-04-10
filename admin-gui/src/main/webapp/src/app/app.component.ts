import {filter, map, mergeMap} from 'rxjs/operators';
/**
 * Created by Xu on 06.04.2017.
 *
 * Base App Component with layout
 */
import {Component, forwardRef, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {UpdaterService} from './updater';
import {PopUpMessageComponent} from './helpers';
import {PopUpUpdateComponent} from './updater';

import {routings} from './app-routing.module';
import {AuthService} from './users';
import {HttpService} from './helpers';
import {UrlService} from './helpers';

//require('semantic-ui');

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    visibility: any = {};
    versionData: string = '';

    @ViewChild(forwardRef(() => PopUpMessageComponent))
    popUpConfirmDwhUpdate!: PopUpMessageComponent;// = new PopUpMessageComponent();

    @ViewChild(forwardRef(() => PopUpUpdateComponent))
    popUpUpdateSummary!: PopUpUpdateComponent;// = new PopUpUpdateComponent(this._updaterService);

    constructor(private _titleService: Title,
                private _authService: AuthService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _http: HttpService,
                private _url: UrlService,
                public _updaterService: UpdaterService,
    ) {
    };

    ngOnInit(): void {
        let title = 'AKTIN - Adminverwaltung';
        this._titleService.setTitle(title);

        // (<any>$('.main.menu')).visibility({
        //   type: 'fixed'
        // });
        //
        // (<any>$('.ui.sticky.go2top'))
        //   .sticky({
        //     context: '.app',
        //   });

        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this._route),
            map(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data),)
            .subscribe((event) => {
                let moreTitle = title;
                if (event['name']) {
                    moreTitle = event['name'] + ' - ' + moreTitle;
                }
                this._titleService.setTitle(moreTitle);
            });

        // give updateService time to check if updateagent is installed
        setTimeout(() => {
            this.showDwhUpdateSummary();
        }, 1500);
    }

    public get version(): string {
        if (!this.versionData) {
            this._http.get(this._url.parse('version'), {responseType: 'text'})
                .subscribe(
                    val => this.versionData = val
                );
        }
        return this.versionData.replace("dwh-j2ee-", "");
    }

    get routings() {
        routings.forEach(route => {
            this.visibility[route.data['name']] = this._authService.userLocalCheckPermissions(route.data['permissions']);
            if (route.hasOwnProperty('children')) {
                let children = route.children!;
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
        if (this._updaterService.checkPermission()) {
            // show the update summary popup after a new update
            // cookie is set prior each update and deleted after closing the popup
            // timeout to give UpdaterService time to load variables
            if (this._updaterService.getCookie('AKTIN.showUpdateSummary') && this._updaterService.isUpdateAgentInstalled) {
                var that = this;
                setTimeout(function () {
                    that.openLastUpdateSummary();
                }, 2000);
                this._updaterService.deleteCookie('AKTIN.showUpdateSummary');
            }
        } else {
            var that = this;
            setTimeout(function () {
                that.showDwhUpdateSummary();
            }, 750);
        }
    }

    openUpdatePopup() {
        if (this._updaterService.isUpdateAgentInstalled) {
            let buttons = ['icon checkmark', 'Updaten', 'green'];
            this.popUpConfirmDwhUpdate.setConfirm(buttons);
            this.popUpConfirmDwhUpdate.onTop = true;
            this.popUpConfirmDwhUpdate.setData(true, 'Update des AKTIN DWH', 'Das AKTIN Data Warehouse soll von der Version ' + this._updaterService.installedVersion + ' auf die Version ' + this._updaterService.candidateVersion + ' aktualisert werden. Diese Aktualisierung wird einige Zeit in Anspruch nehmen. Anschließend wird das Data Warehouse neugestart.',
                (submit: boolean) => {
                    if (submit) {
                        this._router.ngOnDestroy();
                        this._updaterService.executeUpdate()
                    }
                }
            );
        }
    }

    openLastUpdateSummary() {
        if (this._updaterService.isUpdateAgentInstalled) {
            if (this._updaterService.wasUpdateSuccessful) {
                this.openUpdateSuccessPopup();
            } else {
                this.openUpdateFailedPopup();
            }
        }
    }

    openUpdateFailedPopup() {
        this.popUpUpdateSummary.onTop = true;
        this.popUpUpdateSummary.setData(true, 'Update fehlgeschlagen', 'Etwas ist schiefgelaufen. Die alte DWH-Version wurde wiederhergestellt.', 'grey');
    }

    openUpdateSuccessPopup() {
        this.popUpUpdateSummary.onTop = true;
        this.popUpUpdateSummary.setData(true, 'Update erfolgreich', 'Das DWH wurde auf Version ' + this._updaterService.installedVersion + ' aktualisiert.', 'green');
    }

}
