
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
import Timer = NodeJS.Timer;

@Injectable()
export class RequestService {
    private _dataInterval = 3000;

    constructor(
        private _http: HttpInterceptorService,
        private _download: DownloadService,
        private _urls: UrlService,
        private _store: StorageService,
        private _router: Router
    ) {}

    getRequests(): Observable<any> {
        return this._http.get(this._urls.parse('requestList'))
            .catch(err => this._http.handleError(err))
            .map( res => res = _.map(JSON.parse(res.text()), req => LocalRequest.parseRequest(req)) );
    }

    getRequest(requestId: number): Observable<any> {
        return this._http.get(this._urls.parse('request', {requestId: requestId}))
            .catch(err => this._http.handleError(err))
            .map(res => {
                res = LocalRequest.parseRequest(JSON.parse(res.text()));
                if (res.status === RequestStatus.Retrieved) {
                    res.status = this.authorizeRequest(res.requestId, res.status, true);
                }
                return res;
            });
    }

    getQueryBundle(queryId: number): Observable<any> {
        if (queryId == null) {
            return null;
        }
        return this._http.get(this._urls.parse('query', {queryId: queryId}))
            .catch(err => this._http.handleError(err))
            .map(res => { res = JSON.parse(res.text()); res.requests = _.map(res.requests, req => LocalRequest.parseRequest(req));
                res.requests.sort((req1: LocalRequest, req2: LocalRequest) => {
                    return +new Date(req1.query.reference) - +new Date(req2.query.reference);
                });
                return res;
            });
    }

    setQueryRule(requestId: number, action: QueryRuleAction): Observable<any> {
        // let currentRoute = this._router.url;
        return this._http.post(
            this._urls.parse('setQueryRule', {requestId: requestId, action: QueryRuleAction[action]}), {})
            .catch(err => this._http.handleError(err));
            // .subscribe( (res) => {
            //     setTimeout(() => this._router.navigate([currentRoute]), 600);
            // });
    }

    deleteQueryRule(queryId: number): Observable<any> {
        return this._http.delete(this._urls.parse('queryRule', {queryId: queryId}))
        .catch(err => this._http.handleError(err));
    }

    applyRule(queryId: number, ruleAction: QueryRuleAction): Observable<any> {
        return this._http.post(this._urls.parse('applyRule', {queryId: queryId}), JSON.stringify(ruleAction),
            this._http.generateHeaderOptions('Content-Type', 'application/json'))
            .catch(err => this._http.handleError(err));
    }

    updateMarker (requestId: number, marker: RequestMarker): void {
        let currentRoute = this._router.url;
        if (marker === null) {
            this._http.delete(this._urls.parse('updateRequestMarker', {requestId: requestId}))
                .catch(err => {return this._http.handleError(err); })
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
                .catch(err => this._http.handleError(err))
                .subscribe(() => {
                    // this.updateRequest(requestId, null, marker);
                    // this._updateRequests();
                    // console.log(currentRoute);
                    setTimeout(() => this._router.navigate([currentRoute]), 600);
                });
        }
    }

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
                .catch(err => this._http.handleError(err))
                .subscribe(() => {
                    setStatusPost.subscribe(statusCallback);
                });
        } else {
            setStatusPost.subscribe(statusCallback);
        }
        return status;
    }

    authorizeRequest (requestId: number, status: RequestStatus, allow: boolean, autoSubmit?: boolean): RequestStatus {
        let newStatus = LocalRequest.nextStatus(status, allow);
        if (newStatus === null) {
            return status;
        }
        return this.updateStatus(requestId, newStatus, autoSubmit);
    }

    downloadResultFile (requestId: number, result?: string) {
        this._download.get('aktin_anfragen_' + requestId + '_ergebnisse.zip',
            result,
            this._urls.parse('requestResult', {requestId: requestId}));
    }
}
