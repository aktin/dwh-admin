import { Injectable } from '@angular/core';
import { Permission } from '../users/index';
import { AuthService } from '../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';

@Injectable()
export class UpdaterService {

    public version_installed: string;
    public version_candidate: string;
    public isNewUpdateAvailable: boolean = false;
    public wasUpdateSuccessful: boolean = false;
    public log_update: string;

    public isCheckingForUpdates: boolean = false;
    public showAptUpdateError: boolean = false;
    public showDwhUpdateError: boolean = false;

    constructor(
        private _auth: AuthService,
        private _http: HttpInterceptorService,
        private _url: UrlService
    ) {
        this.checkForNewUpdate();
        setInterval(() => this.checkForNewUpdate(), 5000);
        this.getUpdateInfo();
        setInterval(() => this.getUpdateInfo(), 5000);
        this.getUpdateLog();
        this.checkUpdateSuccess();
    }

    checkPermission(): boolean {
        return this._auth.userLocalCheckPermissions([Permission.UPDATE]);
    }

    checkForNewUpdate(): void {
        if (this.version_candidate && this.version_installed)
            this.isNewUpdateAvailable = this.version_installed != this.version_candidate;
        else
            this.isNewUpdateAvailable = false;
    }

    getUpdateInfo(): void {
        this._http.get(this._url.parse('getUpdateInfo'))
            .catch(err => { return this._http.handleError(err); })
            .subscribe(event => {
                if (event._body) {
                    let json_info = JSON.parse(event._body);
                    this.version_installed = json_info['version.installed'];
                    this.version_candidate = json_info['version.candidate'];
                }
            }, (error: any) => {
                console.log(error);
            });
    }

    getUpdateLog(): void {
        this._http.get(this._url.parse('getUpdateLog'))
            .catch(err => { return this._http.handleError(err); })
            .subscribe(event => {
                if (event._body)
                    this.log_update = event._body;
            }, (error: any) => {
                console.log(error);
            });
    }

    reloadAptPackages(): void {
        if (this.checkPermission()) {
            this._http.post(this._url.parse('reloadAptPackages'), null)
                .catch(err => { return this._http.handleError(err); })
                .subscribe(event => {
                    this.isCheckingForUpdates = true;
                    setTimeout(() => { this.isCheckingForUpdates = false; }, 45000);
                }, (error: any) => {
                    console.log(error);
                    this.showAptUpdateError = true;
                });
        }
    }

    executeUpdate(): void {
        if (this.checkPermission()) {
            this._http.post(this._url.parse('updateDWH'), null)
                .catch(err => { return this._http.handleError(err); })
                .subscribe(event => {
                    this.deleteCookie('AKTIN.showUpdateSummary');
                    window.location.href = "/aktin/admin/plain/update.html";
                },
                (error: any) => {
                    console.log(error);
                    this.showDwhUpdateError = true;
                });
        }
    }

    checkUpdateSuccess(): void {
        this._http.get(this._url.parse('checkUpdateSuccess'))
            .catch(err => { return this._http.handleError(err); })
            .subscribe(event => {
                if (event._body)
                    this.wasUpdateSuccessful = JSON.parse(event._body);
            }, (error: any) => {
                console.log(error);
            });
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
