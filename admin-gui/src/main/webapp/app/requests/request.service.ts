
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

    private _updateRequests (): void {
        this._http.debouncedGet<string> (
            'requests',
            this._store.getValue('requests.data'), null,
            this._dataInterval,
            this._urls.parse('requestList'),
            (res: Response) => {
                console.log('updating requests');
                return res.text();
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            (req: string) => {
                if (req) {
                    this._store.setValue('requests.data', req);
                }
            },
            error => console.log(error)
        );
    }


    private _updateRequest (requestId: number, index: number, value: LocalRequest): void {
        this._http.debouncedGet<LocalRequest>(
            'request.' + requestId,
            value, null,
            this._dataInterval,
            this._urls.parse('request', {requestId: requestId}),
            (res: Response) => {
                console.log('updating request ', index);
                return JSON.parse(res.text());
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            (req: LocalRequest) => {
                if (req) {
                    let reqs = JSON.parse(this._store.getValue('requests.data'));
                    if (reqs === null) {
                        reqs = [];
                    }
                    reqs[index] = req;
                    this._store.setValue('requests.data', JSON.stringify(reqs));
                }
            },
            error => console.log(error)
        );
    }

    getRequests (init = true): LocalRequest[] {
        this._updateRequests();

        /*if (init || ! this._updateTimerToggle) {
            console.log('set new timer');
            clearTimeout(this._updateTimer);
            this._updateTimerToggle = true;
            this._updateTimer = setTimeout(() => {
                this._updateTimerToggle = false;
                this.getRequests(false);
            }, this._dataInterval);
        }*/

        return _.map(JSON.parse(this._store.getValue('requests.data')),
                                    req => LocalRequest.parseRequest(req));
    }

    getRequest (requestId = -1): LocalRequest {
        let requests: LocalRequest[] = _.map(JSON.parse(this._store.getValue('requests.data')),
                                    req => LocalRequest.parseRequest(req));

        if (!requests) {
            return null;
        }
        if (requestId < 0) {
            requestId = requests.length - 1;
        }

        let index = _.findIndex(requests, (req) => req.requestId === requestId);
        // let request = _.find(requests, (req) => req.requestId === requestId);
        let request = requests[index];
        if (index < 0) {
            index = 0;
        }

        if (request && request.status === RequestStatus.Retrieved) {
            request.status = this.authorizeRequest(
                request.requestId,
                request.status,
                true);
        }
        console.log('get requests from storage');
        this._updateRequest(requestId, index, request);
        return request;
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
            //    // this._updateQueryRule(queryId);
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

    /**
     * Returns all requests of a series for a given queryId sorted by the reference date.
     * Returns an empty array if the queryId is null which means that the belonging request isn't part of a series.
     *
     * @param {number} queryId - The queryId which is used to specify the series.
     * @return {LocalRequest[]} The Array that contains all requests with the same queryId.
     */
    getRecurringRequests(queryId: number) {
        if (queryId === null) {
              return null;
        }
        let query = this.getRequests();
        query = query.filter(function(req) {
            return req.queryId === queryId;
        });
        return query.sort((req1: LocalRequest, req2: LocalRequest) => {
                    return +new Date(req1.query.reference) - +new Date(req2.query.reference);
        });

    }

    updateMarker (requestId: number, marker: RequestMarker): void {
        let currentRoute = this._router.url;
        if (marker === null) {
            this._http.delete(this._urls.parse('updateRequestMarker', {requestId: requestId}))
                .catch(err => {return this._http.handleError(err); })
                .subscribe(() => {
                    // this.updateRequest(requestId, null, null);
                    this._updateRequests();
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
                    this._updateRequests();
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
            this._updateRequests();
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
