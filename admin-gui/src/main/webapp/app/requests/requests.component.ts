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
    stateFilter: RequestStatus | string = 'auth';
    constructor(private _requestService: RequestService) { }

    get stateFilterArray(): [string, RequestStatus|string][] {
        return [
            [ 'Keine Filter', 'all' ],
            [ 'Aktion erforderlich', 'auth' ],
            [ 'Neue Anfragen', 'new' ],
            [ 'Gelöschte Anfragen', 'hidden' ],
        ];
    }

    get requests(): LocalRequest[] {
        this.requestsData = this._requestService.getRequests();
        return this.requestsData;
    }
}
