/**
 * Created by Xu on 14-Jun-17.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';
import { LocalRequest } from './request';
import Timer = NodeJS.Timer;

@Component({
    templateUrl: './request-single.component.html',
    styleUrls: ['./requests.component.css'],
})
export class RequestSingleComponent implements OnInit, OnDestroy {
    req: LocalRequest;
    reqId: number;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    private _updateTimer: Timer;
    private _updateTimerToggle = false;
    private _dataInterval = 5000;

    constructor(
        private _route: ActivatedRoute,
        private _requestService: RequestService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
            this.reqId = +params['id'];
                return this._requestService.getRequest(+params['id']);
            }).subscribe(
            req => {
                // console.log(req);
                this.req = req;
            }
        );
    }

    ngOnDestroy(): void {
        console.log('call clear timer');
        clearTimeout(this._updateTimer);

        // this._requestService.clearUpdate();
    }

    updateRequest (): void {
        if (this._updateTimerToggle) {
            return;
        }
        console.log('set new timer');
        clearTimeout(this._updateTimer);
        this._updateTimerToggle = true;
        this._updateTimer = setTimeout(() => {
            this._updateTimerToggle = false;
                this.updateRequest ();
            }, this._dataInterval);
        this.req = this._requestService.getRequest(this.reqId);
    }

    get request (): LocalRequest {
        if (!this.req) {
            this.req = this._requestService.getRequest(this.reqId);
        }
        this.updateRequest ();
        return this.req;
    }
}
