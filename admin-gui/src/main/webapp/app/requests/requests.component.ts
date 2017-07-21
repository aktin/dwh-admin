/**
 * Created by Xu on 04.05.2017.
 */
import { Component } from '@angular/core';

import { RequestService } from './request.service';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css'],
})
export class RequestsComponent  {
    requestsData: LocalRequest[];
    status: RequestStatus = null;
    showHidden = false;
    onlyStarred = false;
    statiFilter = [''];
    debug = true;
// TODO add actions to the radio buttons
    constructor(private _requestService: RequestService) {
    }

    get requests(): LocalRequest[] {
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
    }
    get statusFilter (): RequestStatus {
        return this.status;
    }
    get markerFilter (): RequestMarker {
        if (this.onlyStarred) {
            return RequestMarker.STARRED;
        }
        if (this.showHidden) {
            return RequestMarker.HIDDEN;
        }
        return null;
    }
}
