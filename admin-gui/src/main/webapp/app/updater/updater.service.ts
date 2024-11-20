import { Injectable } from '@angular/core';
import { Permission } from '../users/index';
import { AuthService } from '../users/auth.service';
import { UrlService, HttpInterceptorService } from '../helpers/index';

@Injectable()
export class UpdaterService {

    public isUpdateAgentInstalled: boolean = false;

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
        this.checkUpdateAgentInstallation();
        this.reloadAptPackages(false);
        setTimeout(() => {
            this.getUpdateLog();
            this.checkUpdateSuccess();
            this.checkForNewUpdate();
            setInterval(() => {
                this.getUpdateLog();
                this.checkUpdateSuccess();
                this.checkForNewUpdate();
            }, 5000);
        }, 1500);
    }

    checkPermission(): boolean {
        return this._auth.userLocalCheckPermissions([Permission.UPDATE]);
    }

    checkUpdateAgentInstallation(): void {
        this._http.get(this._url.parse('updateAgentInstalled'))
            .catch(err => { return this._http.handleError(err); })
            .subscribe(event => {
                if (event._body)
                    this.isUpdateAgentInstalled = JSON.parse(event._body);
            }, (error: any) => {
                console.log(error);
            });
    }

    checkForNewUpdate(): void {
        if (this.isUpdateAgentInstalled) {
            this.getUpdateInfo();
            setTimeout(() => {
                if (this.version_candidate && this.version_installed)
                    this.isNewUpdateAvailable = this.version_installed != this.version_candidate;
                else
                    this.isNewUpdateAvailable = false;
            }, 1500);
        }
    }

    getUpdateInfo(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get(this._url.parse('updateDWH'))
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
    }

    getUpdateLog(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get(this._url.parse('getUpdateLog'))
                .catch(err => { return this._http.handleError(err); })
                .subscribe(event => {
                    if (event._body)
                        this.log_update = event._body;
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    checkUpdateSuccess(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get(this._url.parse('checkUpdateSuccess'))
                .catch(err => { return this._http.handleError(err); })
                .subscribe(event => {
                    if (event._body)
                        this.wasUpdateSuccessful = JSON.parse(event._body);
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    executeUpdate(): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this._http.post(this._url.parse('updateDWH'), null)
                .catch(err => { return this._http.handleError(err); })
                .subscribe(event => {
                    this.setCookie('AKTIN.showUpdateSummary', 'true');
                    window.location.href = "/aktin/admin/plain/update.html";
                }, (error: any) => {
                    console.log(error);
                    this.showDwhUpdateError = true;
                });
        }
    }

    reloadAptPackages(showFeedback: boolean = true): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this._http.post(this._url.parse('reloadAptPackages'), null)
            .catch(err => this._http.handleError(err))
            .subscribe(event => {
                if (showFeedback) {
                    this.isCheckingForUpdates = true;
                    setTimeout(() => { this.isCheckingForUpdates = false; }, 15000);
                }
            }, error => {
                console.log(error);
                this.showAptUpdateError = true;
            });
        }
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
