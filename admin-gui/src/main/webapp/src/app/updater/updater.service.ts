import {Injectable} from '@angular/core';
import {AuthService, Permission} from '../users';
import {HttpService, UrlService} from '../helpers';
import {catchError, finalize} from "rxjs/operators";

/**
 * Service responsible for managing DWH (Data Warehouse) updates and update-related operations.
 * This service interacts with the backend update agent to check for updates, manage update status,
 * and execute update operations. It also handles update-related UI states and error conditions.
 */
@Injectable()
export class UpdaterService {

    /** Flag indicating if the backend update agent is installed and available */
    public isUpdateAgentInstalled: boolean = false;
    /** Currently installed DWH version */
    public installedVersion: string;
    /** Available update version (if any) */
    public candidateVersion: string;

    /** Flag indicating if a new version is available for update */
    public isNewUpdateAvailable: boolean = false;
    /** Flag indicating if the last update operation was successful */
    public wasUpdateSuccessful: boolean = false;
    /** Content of the update operation log */
    public updateLog: string;

    /** Flag indicating if the service is currently checking for updates */
    public isCheckingForUpdates: boolean = false;
    /** Flag indicating if an APT update operation failed */
    public showAptUpdateError: boolean = false;
    /** Flag indicating if a DWH update operation failed */
    public showDwhUpdateError: boolean = false;

    /**
     * Creates an instance of UpdaterService.
     * Initializes the service by checking update agent installation,
     * reloading package information, and fetching initial status.
     *
     * @param _auth - Service for authentication and permission checking
     * @param _http - Service for making HTTP requests
     * @param _url - Service for URL management
     */
    constructor(
        private _auth: AuthService,
        private _http: HttpService,
        private _url: UrlService
    ) {
        this.checkUpdateAgentInstallation();
        this.reloadAptPackages(false);
        setTimeout(() => {
            this.getUpdateStatus();
            this.getUpdateLog();
        }, 2000);
    }

    checkPermission(): boolean {
        return this._auth.userLocalCheckPermissions([Permission.UPDATE]);
    }

    checkUpdateAgentInstallation(): void {
        this._http.get<string>(this._url.parse('updateAgentInstalled'))
            .pipe(catchError(err => { return this._http.handleError(err); }))
            .subscribe(event => {
                if (event)
                    this.isUpdateAgentInstalled = JSON.parse(event);
            }, (error: any) => {
                console.log(error);
            });
    }

    /**
     * Retrieves the current update status from the backend.
     * Updates version information and status flags based on the response.
     * Only executes if the update agent is installed.
     */
    getUpdateStatus(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get<string>(this._url.parse('updateDWH'))
            .pipe(catchError(err => this._http.handleError(err)))
            .subscribe(event => {
                if (event) {
                    let json_info = JSON.parse(event);
                    this.installedVersion = json_info['installedVersion'];
                    this.candidateVersion = json_info['candidateVersion'];
                    this.wasUpdateSuccessful = json_info['success'];
                    this.isNewUpdateAvailable = this.installedVersion !== this.candidateVersion;
                }
            }, error => {
                console.error(error);
            });
        }
    }

    /**
     * Retrieves the update operation log from the backend.
     * Only executes if the update agent is installed.
     */
    getUpdateLog(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get<string>(this._url.parse('getUpdateLog'))
                .pipe(catchError(err => { return this._http.handleError(err); }))
                .subscribe(event => {
                    if (event)
                        this.updateLog = event;
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    /**
     * Executes a DWH update operation.
     * Requires UPDATE permission and installed update agent.
     * Sets a cookie to show update summary and redirects to update page on success.
     * Updates package information and log after completion.
     */
    executeUpdate(): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this._http.post(this._url.parse('updateDWH'), null)
                .pipe(catchError(err => { return this._http.handleError(err); }),
                    finalize(() => {
                            this.reloadAptPackages();
                            this.getUpdateLog();
                        }))
                .subscribe(event => {
                    this.setCookie('AKTIN.showUpdateSummary', 'true');
                    window.location.href = "/aktin/admin/plain/update.html";
                }, (error: any) => {
                    console.log(error);
                    this.showDwhUpdateError = true;
                });
        }
    }

    /**
     * Reloads APT package information from the backend.
     * Requires UPDATE permission and installed update agent.
     * Updates status information after completion.
     *
     * @param showFeedback - If true, shows a loading indicator for 15 seconds.
     *                       Default is true. Set to false for background updates.
     */
    reloadAptPackages(showFeedback: boolean = true): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this._http.post(this._url.parse('reloadAptPackages'), null)
            .pipe(catchError(err => this._http.handleError(err)),
                    finalize(() => this.getUpdateStatus()))
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
        document.cookie = name + "=" + (value || "") + "; path=/; SameSite=Lax;";
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
        document.cookie = name + '=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
