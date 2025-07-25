/**
 * Created by Xu on 14-Jun-17.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {forkJoin, of, switchMap, tap, timer} from 'rxjs';

import {RequestService} from './request.service';
import {LocalRequest, QueryBundle, RequestMarker, RequestStatus} from './request';
import {ModalRef} from '../helpers/modal/modal-ref.component';
import {IModalConfig, MODAL_CONFIG} from '../helpers/modal/modal.service';
import {Location} from '@angular/common';

@Component({
    selector: 'request-single',
    templateUrl: './request-single.component.html',
    styleUrls: ['./requests.component.less', '../helpers/popup-message.component.css'],
})
export class RequestSingleComponent implements OnInit {
    request: LocalRequest;
    requestUnmapped: LocalRequest;
    requestEtag = '0';
    queryBundle: QueryBundle;
    bundleEtag = '0';
    queryDetails: any = {};
    bundleLoaded = false;
    requestLoaded = false;
    protected readonly RequestMarker = RequestMarker;
    private _dataInterval = 5000;

    constructor(
        private _requestService: RequestService,
        private _modalRef: ModalRef<RequestSingleComponent>,
        private _location: Location,
        @Inject(MODAL_CONFIG) modalConfig: IModalConfig,
    ) {
        this.reqId = modalConfig.data.reqId;
    }

    private _reqId: number;

    get reqId(): number {
        return this._reqId;
    }

    set reqId(value: number) {
        this._reqId = value;
        //reflect any request id changes in the url without reloading the component
        this._location.go(`/request/${this.reqId}`);
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

    ngOnInit(): void {
        this.loadRequests(this.reqId);
    }

    public loadRequests(reqId: number): void {
        this.reqId = reqId;
        // set request and belonging etag
        forkJoin([this._requestService.getRequest(this.reqId, this.requestEtag, true),
            this._requestService.getRequest(this.reqId, this.requestEtag, false)])
            .pipe(switchMap(([request, unmappedRequest]) => {
                this.request = request['req'] as LocalRequest;
                this.requestEtag = request['etag'];
                this.requestUnmapped = unmappedRequest['req'];
                if (this.request.isRecurring()) {
                    // set query bundle and belonging etag
                    return this._requestService.getQueryBundle(this.request.queryId, this.bundleEtag)
                               .pipe(tap(bundle => {
                                   this.queryBundle = bundle['bundle'];
                                   this.bundleEtag = bundle['etag'];
                                   this.updateQueryDetails();
                                   this.bundleLoaded = true;
                               }));
                } else {
                    return of(null);
                }
            })).subscribe(() => {
            this.bundleLoaded = true;
            this.requestLoaded = true;
        });
        // set timer to update request and query bundle in the given interval in case the etag changed (hence request was modified)
        let timer$ = timer(0, this._dataInterval);
        timer$.subscribe(() => {
            if (this.request) {
                this.updateRequest();
                if (this.request.isRecurring()) {
                    this.updateQueryBundle();
                }
            }
        });
    }

    /**
     * Updates the request if the etag changed (hence request was modified).
     */
    updateRequest(): void {
        this._requestService.getRequest(this.reqId, this.requestEtag, true)
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
            req => req.status !== RequestStatus.Retrieved && req.status !== RequestStatus.Seen
                && req.status !== RequestStatus.Rejected).length;
        let submitted = query.filter(
            req => req.status === RequestStatus.Submitted).length;
        this.queryDetails[this.request.queryId] = {
            'order': order,
            'rejected': rejected,
            'accepted': accepted,
            'submitted': submitted
        };
    }

    public close(): void {
        this._modalRef.close();
    }

    public get numInSeries(): number {
        const reverted = this.queryBundle.requests.slice().reverse();
        const index = reverted.findIndex(req => req.requestId === this.request.requestId) ?? 0;
        return this.queryBundle?.requests?.length - index;
    }
}
