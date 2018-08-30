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
    etag = '0';
    queryBundle: QueryBundle;
    queryDetails: Object = {};
    bundleLoaded = false;
    requestLoaded = false;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    private _dataInterval = 5000;
    private _timerSubscription: Subscription;
    private _paramsSubscription: Subscription;

    constructor(
        private _route: ActivatedRoute,
        private _requestService: RequestService,
    ) {}

    ngOnInit(): void {
        this._route.params
            .subscribe((params: Params) => {
                this.reqId = +params['id'];
                this._requestService.getRequest(this.reqId, this.etag)
                    .subscribe(res => {
                        this.request = res['req'];
                        this.etag = res['etag'];
                        this.requestLoaded = true;
                        if (!this.request.isRecurring()) {
                            this.bundleLoaded = true;
                        } else {
                            this._requestService.getQueryBundle(this.request.queryId)
                                .subscribe(bundle => {
                                    this.queryBundle = bundle;
                                    this.updateQueryDetails();
                                    this.bundleLoaded = true;
                                });
                        }
                    });
            });
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

    get dataLoaded() {
        if (this.requestLoaded && this.bundleLoaded) {
            return true;
        }
        return false;
    }

    updateRequest(): void {
        this._requestService.getRequest(this.reqId, this.etag)
            .subscribe(res => {
                console.log('update request');
                this.request = res['req'];
                this.etag = res['etag'];
            });
    }

    updateQueryBundle() {
        this._requestService.getQueryBundle(this.request.queryId)
            .subscribe(res => {
                console.log('update queryBundle');
                this.queryBundle = res;
                this.updateQueryDetails();
            });
    }

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
