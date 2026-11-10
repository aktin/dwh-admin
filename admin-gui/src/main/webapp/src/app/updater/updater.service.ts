import {Injectable} from '@angular/core';
import {AuthService, Permission} from '../users';
import {HttpService, UrlService} from '../helpers';
import {StatusService} from '../status';
import {catchError, concatMap, finalize, map, switchMap, take, takeWhile, tap} from "rxjs/operators";
import {EMPTY, Observable, timer} from "rxjs";

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
    /** Timestamp of the last version check, used to detect a stale status after an update status refresh */
    private lastCheckTime: string;

    /** Flag indicating if the service is currently checking for updates */
    public isCheckingForUpdates: boolean = false;
    /** Flag indicating if an APT update operation failed */
    public showAptUpdateError: boolean = false;
    /** Flag indicating if a DWH update operation failed */
    public showDwhUpdateError: boolean = false;

    /**
     * Creates an instance of UpdaterService.
     * Initializes the service by checking update agent installation,
     * refreshing the update status, and fetching initial status.
     *
     * @param _auth - Service for authentication and permission checking
     * @param _http - Service for making HTTP requests
     * @param _url - Service for URL management
     * @param _status - Service for the import summary, provides the server start time
     */
    constructor(
        private _auth: AuthService,
        private _http: HttpService,
        private _url: UrlService,
        private _status: StatusService
    ) {
        this.checkUpdateAgentInstallation().subscribe(() => {
            this.getUpdateLog();
            this.getUpdateStatus()
                .pipe(finalize(() => this.refreshUpdateStatus(false)))
                .subscribe({error: error => console.error(error)});
        }, (error: any) => {
            console.log(error);
        });
    }

    checkPermission(): boolean {
        return this._auth.userLocalCheckPermissions([Permission.UPDATE]);
    }

    /** Checks if the backend update agent is installed and stores the result in isUpdateAgentInstalled. */
    checkUpdateAgentInstallation(): Observable<string> {
        return this._http.get<string>(this._url.parse('updateAgentInstalled'))
            .pipe(
                catchError(err => { return this._http.handleError(err); }),
                tap(event => {
                    if (event)
                        this.isUpdateAgentInstalled = JSON.parse(event);
                })
            );
    }

    /**
     * Retrieves the current update status from the backend.
     * Updates version information and status based on the response.
     *
     * @returns Observable that stores the status when subscribed
     */
    getUpdateStatus(): Observable<any> {
        if (!this.isUpdateAgentInstalled) {
            return EMPTY;
        }
        return this._http.get<any>(this._url.parse('updateDWH'))
            .pipe(
                catchError(err => this._http.handleError(err)),
                tap(event => {if (event) {
                        this.installedVersion = event.installedVersion;
                        this.candidateVersion = event.candidateVersion;
                        this.wasUpdateSuccessful = event.success;
                        this.lastCheckTime = event.lastCheckTime;
                        this.isNewUpdateAvailable = this.installedVersion !== this.candidateVersion;
                    }
                })
            );
    }

    /**
     * Retrieves the update operation log from the backend.
     * Only executes if the update agent is installed.
     */
    getUpdateLog(): void {
        if (this.isUpdateAgentInstalled) {
            this._http.get(this._url.parse('getUpdateLog'), {responseType: 'text'})
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
     * Sets a cookie to show update summary and redirects to update page on success,
     * passing the pre-update server start time so the page can detect the restart.
     * Updates the log after completion.
     */
    executeUpdate(): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this._status.getImportStatus()
                .pipe(switchMap(status => this._http.post(this._url.parse('updateDWH'), null)
                        .pipe(map(() => status.start.getTime()))),
                    catchError(err => { return this._http.handleError(err); }),
                    finalize(() => this.getUpdateLog()))
                .subscribe(start => {
                    this.setCookie('AKTIN.showUpdateSummary', 'true');
                    window.location.href = "/aktin/admin/plain/update.html?since=" + start;
                }, (error: any) => {
                    console.log(error);
                    this.showDwhUpdateError = this.checkPermission();
                });
        }
    }

    /**
     * Triggers an update status refresh in the backend.
     * Requires UPDATE permission and installed update agent.
     * Updates status information after a successful refresh.
     *
     * @param showFeedback - If true, shows a loading indicator while polling for the refreshed status.
     *                       Default is true. Set to false for background updates.
     */
    refreshUpdateStatus(showFeedback: boolean = true): void {
        if (this.checkPermission() && this.isUpdateAgentInstalled) {
            this.showAptUpdateError = false;    // hide error banner when attempting status refresh
            this._http.post(this._url.parse('refreshUpdateStatus'), null)
            .pipe(catchError(err => this._http.handleError(err)))
            .subscribe(event => {
                if (showFeedback) {
                    this.isCheckingForUpdates = true;
                }
                const previousCheckTime = this.lastCheckTime;
                // the agent writes the refreshed status asynchronously, poll every second until it changes
                timer(0, 1000).pipe(
                    take(15),
                    concatMap(() => this.getUpdateStatus()),
                    takeWhile(status => status?.lastCheckTime === previousCheckTime),
                    finalize(() => this.isCheckingForUpdates = false)
                ).subscribe({error: error => console.error(error)});
            }, error => {
                console.log(error);
                this.showAptUpdateError = this.checkPermission();
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
