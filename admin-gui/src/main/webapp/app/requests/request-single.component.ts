/**
 * Created by Xu on 14-Jun-17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { RequestService } from './request.service';
import { LocalRequest } from './request';

@Component({
    templateUrl: './request-single.component.html',
})
export class RequestSingleComponent implements OnInit {
    request: LocalRequest;

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
                this.request = req;
            }
        );
    }
}
