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
    stateFilter: RequestStatus | string = 'auth';
    constructor(private _requestService: RequestService) { }

    get stateFilterArray(): [string, RequestStatus|string][] {
        return [
            [ 'Aktion erforderlich', 'auth' ],
            [ 'Alle', 'all' ],
            [ 'Neue Anfragen', RequestStatus.Retrieved ],
            // [ 'Abgeschlosse Anfragen', 'done' ],
        ];
    }

    get requests(): LocalRequest[] {
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
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
