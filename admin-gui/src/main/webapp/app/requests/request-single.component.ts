/**
 * Created by Xu on 14-Jun-17.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';

import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';
import { LocalRequest, QueryBundle, RequestStatus } from './request';

@Component({
    templateUrl: './request-single.component.html',
    styleUrls: ['./requests.component.css'],
})
export class RequestSingleComponent implements OnInit, OnDestroy {
    request: LocalRequest;
    reqId: number;
    requestEtag = '0';
    queryBundle: QueryBundle;
    bundleEtag = '0';
    queryDetails: Object = {};
    bundleLoaded = false;
    requestLoaded = false;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    private _dataInterval = 5000;
    private _timerSubscription: Subscription;

    constructor(
        private _route: ActivatedRoute,
        private _requestService: RequestService,
    ) {}

    ngOnInit(): void {
        this._route.params
            .subscribe((params: Params) => {
                this.reqId = +params['id'];
                // set request and belonging etag
                this._requestService.getRequest(this.reqId, this.requestEtag)
                    .subscribe(res => {
                        this.request = res['req'];
                        this.requestEtag = res['etag'];
                        this.requestLoaded = true;
                        if (!this.request.isRecurring()) {
                            this.bundleLoaded = true;
                        } else {
                            // set query bundle and belonging etag
                            this._requestService.getQueryBundle(this.request.queryId, this.bundleEtag)
                                .subscribe(bundle => {
                                    this.queryBundle = bundle['bundle'];
                                    this.bundleEtag = bundle['etag'];
                                    this.updateQueryDetails();
                                    this.bundleLoaded = true;
                                });
                        }
                    });
            });
        // set timer to update request and query bundle in the given interval in case the etag changed (hence request was modified)
        let timer = TimerObservable.create(0, this._dataInterval);
        this._timerSubscription = timer.subscribe(() => {
            if (this.request) {
                this.updateRequest();
                if (this.request.isRecurring()) {
                    this.updateQueryBundle();
                }
            }
        });
    }

    ngOnDestroy(): void {
        console.log('unsubscribe timer');
        this._timerSubscription.unsubscribe();
    }

    /**
     * Checks if the request and the query bundle (if request is recurring) are initialized.
     * Makes sure that the view is rendered after the asynch call is completed.
     * @returns true if necessary data is loaded, false otherwise
     */
    get dataLoaded() {
        if (this.requestLoaded && this.bundleLoaded) {
            return true;
        }
        return false;
    }

    /**
     * Updates the request if the etag changed (hence request was modified).
     */
    updateRequest(): void {
        this._requestService.getRequest(this.reqId, this.requestEtag)
            .subscribe(res => {
                console.log('update request');
                this.request = res['req'];
                this.requestEtag = res['etag'];
            });
    }

    /**
     * Updates the query bundle if the etag changed (hence one of the request of the bundle or the query rule was modified).
     */
    updateQueryBundle() {
        this._requestService.getQueryBundle(this.request.queryId, this.bundleEtag)
            .subscribe(res => {
                console.log('update queryBundle');
                this.queryBundle = res['bundle'];
                this.bundleEtag = res['etag'];
                this.updateQueryDetails();
            });
    }

    /**
     * Updates the query details by calculating all values new using the requests of the query bundle as base.
     */
    updateQueryDetails() {
        let query = this.queryBundle.requests;
        let order: number[] = [];
        query.forEach(request => {
            order.push(request.requestId);
        });
        let rejected = query.filter(
            req => req.status === RequestStatus.Rejected).length;
        let accepted = query.filter(
            req => req.status !== RequestStatus.Retrieved &&  req.status !== RequestStatus.Seen
                &&  req.status !== RequestStatus.Rejected).length;
        let submitted = query.filter(
            req => req.status === RequestStatus.Submitted).length;
        this.queryDetails[this.request.queryId] = { 'order': order, 'rejected': rejected, 'accepted': accepted, 'submitted': submitted };
    }
}
