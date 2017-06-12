/**
 * Created by Xu on 04.05.2017.
 */
import { Component } from '@angular/core';

import { RequestService } from './request.service';
import { LocalRequest } from './request';

@Component({
    templateUrl: './requests.component.html',
})
export class RequestsComponent  {
    requestsData: LocalRequest[];

    constructor(private _requestService: RequestService) {
    }

    get requests(): LocalRequest[] {
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
    }
}
