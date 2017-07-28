/**
 * Created by Xu on 14-Jun-17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';
import { LocalRequest } from './request';

@Component({
    templateUrl: './request-single.component.html',
    styleUrls: ['./requests.component.css'],
})
export class RequestSingleComponent implements OnInit {
    request: LocalRequest;
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

    constructor(
        private _route: ActivatedRoute,
        private _requestService: RequestService
    ) {}

    ngOnInit(): void {
        this._route.params
            .map((params: Params) => {
                return this._requestService.getRequest(+params['id']);
            }).subscribe(
            req => {
                // console.log(req);
                this.request = req;
            }
        );
    }
}
