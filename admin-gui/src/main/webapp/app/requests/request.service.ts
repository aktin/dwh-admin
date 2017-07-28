/**
 * Created by Xu on 08-Jun-17.
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService } from '../helpers/index';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Injectable()
export class RequestService {
    private _dataInterval = 300;

    constructor(
        private _http: HttpInterceptorService,
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

    getRequests (): LocalRequest[] {
        this._updateRequests();
        return _.map(JSON.parse(this._store.getValue('requests.data')),
                                    req => LocalRequest.parseRequest(req));
    }

    getRequest (requestId: number = -1): LocalRequest {
        let requests: LocalRequest[] = this.getRequests();

        if (!requests) {
            return null;
        }
        if (requestId < 0) {
            requestId = requests.length - 1;
        }

        let request = _.find(requests, (req) => req.requestId === requestId);

        if (request.status === RequestStatus.Retrieved) {
            request.status = this.authorizeRequest(
                request.requestId,
                request.status,
                true);
        }

        return request;
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
         return this.updateStatus(requestId, LocalRequest.nextStatus(status, allow), autoSubmit);
    }
}
