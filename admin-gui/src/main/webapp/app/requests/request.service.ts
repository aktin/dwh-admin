
/**
 * Created by Xu on 08-Jun-17.
 */
import { Injectable } from '@angular/core';
import { Response, ResponseContentType, Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');
import FileSaver = require('file-saver');

import { StorageService, UrlService, HttpInterceptorService, DownloadService } from '../helpers/index';
import { LocalRequest, RequestMarker, RequestStatus, QueryBundle, Query, Rule, QueryRuleAction } from './request';
import { AuthService } from './../users/auth.service';
import { Permission } from '../users/index';
import Timer = NodeJS.Timer;

@Injectable()
export class RequestService {

    constructor(
        private _http: HttpInterceptorService,
        private _download: DownloadService,
        private _urls: UrlService,
        private _router: Router,
        private _auth: AuthService
    ) {}

    /**
     * Checks if the user has the given permission.
     * @param permission The permission that will be checked.
     * @returns true if user has the permission, false otherwise
     */
    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_REQUESTS':
                perm = Permission.READ_REQUESTS;
                break;
            case 'WRITE_REQUESTS':
                perm = Permission.WRITE_REQUESTS;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

    /**
     * Gets all available requests from the server ordered by the id. Uses a 'conditional get' by setting an etag.
     * Only if the etag from the response differs from the given one, the actual data will be send in the response.
     * Otherwise the cached data will be used (HTTP status 304).
     * @param etag The current etag that will be compared with the one from the response.
     * @returns Observable of an object that includes the requests and the new etag
     */
    getRequests(etag: string): Observable<Object> {
        let options = { headers: new Headers({'If-None-Match': etag}),  'observe': 'response' };
        return this._http.get(this._urls.parse('requestList'), options)
            .catch(err => { return this._http.handleError(err) })
            .map(resp => {
                let res = {};
                res['etag'] = resp.headers.get('ETag');
                res['req'] = _.map(JSON.parse(resp.text()), req => LocalRequest.parseRequest(req));
                res['req'].sort((req1: LocalRequest, req2: LocalRequest) => {
                    return req1.requestId - req2.requestId;
                });
                return res;
            });
    }

     /**
     * Gets the request with the given id from the server. Uses a 'conditional get' by setting an etag.
     * Only if the etag from the response differs from the given one, the actual data will be send in the response.
     * Otherwise the cached data will be used (HTTP status 304).
     * @param etag The current etag that will be compared with the one from the response.
     * @returns Observable of an object that includes the request and the new etag
     */
    getRequest(requestId: number, etag: string, mapping: boolean): Observable<Object> {
        let options = { headers: new Headers({'If-None-Match': etag}),  observe: 'response' };
        let url = '';
        if ( mapping === true) {
            url = 'request';
        } else {
            url = 'requestUnmapped';
        }
        return this._http.get(this._urls.parse(url, {requestId: requestId}), options).catch(err => { return this._http.handleError(err) })
            .map(resp => {
                let res = {};
                res['etag'] = resp.headers.get('ETag');
                res['req'] = LocalRequest.parseRequest(JSON.parse(resp.text()));
                if (res['req'].status === RequestStatus.Retrieved) {
                    res['req'].status = this.authorizeRequest(res['req'].requestId, res['req'].status, true);
                }
                return res;
            });
    }

     /**
     * Gets the query bundle (requests + rule of series) with the given id from the server. Uses a 'conditional get' by setting an etag.
     * Only if the etag from the response differs from the given one, the actual data will be send in the response.
     * Otherwise the cached data will be used (HTTP status 304).
     * @param etag The current etag that will be compared with the one from the response.
     * @returns Observable of an object that includes the query bundel and the new etag, null if the given query id is null
     */
    getQueryBundle(queryId: number, etag: string): Observable<Object> {
        let options = { headers: new Headers({'If-None-Match': etag}),  observe: 'response' };
        if (queryId === null) {
            return null;
        }
        return this._http.get(this._urls.parse('query', {queryId: queryId}), options)
            .catch(err => { return this._http.handleError(err) })
            .map(resp => {
                let res = {};
                res['etag'] = resp.headers.get('ETag');
                res['bundle'] = JSON.parse(resp.text());
                res['bundle'].requests = _.map( res['bundle'].requests, req => LocalRequest.parseRequest(req));
                res['bundle'].requests.sort((req1: LocalRequest, req2: LocalRequest) => {
                    if (+new Date(req1.query.reference) === +new Date(req2.query.reference)) {
                        return req1.requestId - req2.requestId;
                    } else {
                        return +new Date(req1.query.reference) - +new Date(req2.query.reference);
                    }
                });
                if (res['bundle'].rule) {
                    res['bundle'].rule.creationDate = new Date(res['bundle'].rule.creationDate);
                }
                return res;
            });
    }

    /**
     * Sets the query rule for the series to which the given request id belongs to by post request.
     * @param requestId The id of the request for whose belonging series the rule will be set.
     * @param action The rule that will be set.
     * @returns Observable of response
     */
    setQueryRule(requestId: number, action: QueryRuleAction): Observable<Response> {
        return this._http.post(
            this._urls.parse('setQueryRule', {requestId: requestId, action: QueryRuleAction[action]}), {})
            .catch(err => { return this._http.handleError(err) });
    }

    /**
     * Deletes the query rule specified by the given query id.
     * @param queryId The id of the series whose rule will be deleted.
     * @returns Observable of response
     */
    deleteQueryRule(queryId: number): Observable<Response> {
        return this._http.delete(this._urls.parse('queryRule', {queryId: queryId}))
        .catch(err => { return this._http.handleError(err) })
    }

    /**
     * Applies the given rule to the series with the given query id.
     * This includes every already existing request of the series without a final status.
     * @param queryId The id of the series to whose requests the rule will be applied.
     * @param ruleAction The rule that will be applied.
     * @returns Observable of response
     */
    applyRule(queryId: number, ruleAction: QueryRuleAction): Observable<Response> {
        return this._http.post(this._urls.parse('applyRule', {queryId: queryId}), JSON.stringify(ruleAction),
            this._http.generateHeaderOptions('Content-Type', 'application/json'))
            .catch(err => { return this._http.handleError(err) })
    }

    /**
     * Updates the marker of the request specified by the given request id.
     * @param requestId The id of the request whose marker will be updated.
     * @param marker The marker value (STARRED, HIDDEN or null).
     */
    updateMarker (requestId: number, marker: RequestMarker): void {
        let currentRoute = this._router.url;
        if (marker === null) {
            this._http.delete(this._urls.parse('updateRequestMarker', {requestId: requestId}))
                .catch(err => { return this._http.handleError(err); })
                .subscribe(() => {
                    // this.updateRequest(requestId, null, null);
                    // this._updateRequests();
                    // console.log(currentRoute);
                    setTimeout(() => this._router.navigate([currentRoute]), 600);
                });
        } else {
            this._http.put(this._urls.parse('updateRequestMarker', {requestId: requestId}),
                    JSON.stringify(RequestMarker[marker]),
                    this._http.generateHeaderOptions('Content-Type', 'application/json')
                )
                .catch(err => { return this._http.handleError(err) })
                .subscribe(() => {
                    // this.updateRequest(requestId, null, marker);
                    // this._updateRequests();
                    // console.log(currentRoute);
                    setTimeout(() => this._router.navigate([currentRoute]), 600);
                });
        }
    }

    /**
     * Updates the status of the request specified by the given id.
     * @param requestId The id of the request whose status will be updated.
     * @param status The new status of the request.
     * @param autoSubmit Optional: Whether auto submit is selected.
     * @returns the new status
     */
    updateStatus (requestId: number, status: RequestStatus, autoSubmit?: boolean): RequestStatus {
        let currentRoute = this._router.url;
        let setStatusPost = this._http.post(this._urls.parse('setRequestStatus', {requestId: requestId, status: RequestStatus[status]}), {})
            .catch(err => this._http.handleError(err));
        let statusCallback = () => {
            // this.updateRequest(requestId, null, marker);
            // this._updateRequests();
            // console.log(currentRoute);
            setTimeout(() => this._router.navigate([currentRoute]), 600);
        };
        if (autoSubmit) {
            this._http.post(this._urls.parse('setRequestAutoSubmit', {requestId: requestId, submit: autoSubmit}), {})
                .catch(err => { return this._http.handleError(err) })
                .subscribe(() => {
                    setStatusPost.subscribe(statusCallback);
                });
        } else {
            setStatusPost.subscribe(statusCallback);
        }
        return status;
    }

    /**
     * Determines and updates the new status of the request specified by the given id.
     * New status depends on the current status, wheteher auto submit is selected and wheteher request was accepted or rejected.
     * @param requestId The id of the request whose status will be determined.
     * @param status The current status of the request.
     * @param allow Whether the request was accepted or rejected.
     * @param autoSubmit Optional: Whether auto submit is selected.
     * @returns the new status
     */
    authorizeRequest (requestId: number, status: RequestStatus, allow: boolean, autoSubmit?: boolean): RequestStatus {
        let newStatus = LocalRequest.nextStatus(status, allow);
        if (newStatus === null) {
            return status;
        }
        return this.updateStatus(requestId, newStatus, autoSubmit);
    }

    /**
     * Downloads the results of a completed request execution.
     * @param requestId The id of the request whose results will be downloaded.
     * @param results Optional: The result type (in this case application/zip).
     */
    downloadResultFile (requestId: number, result?: string) {
        this._download.get('aktin_anfragen_' + requestId + '_ergebnisse.zip',
            result,
            this._urls.parse('requestResult', {requestId: requestId}));
    }
}
