/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input }     from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';
import { RequestService } from './request.service';

@Component({
    selector: 'request-single-view',
    templateUrl: './request-single-view.component.html',
    // styleUrls: ['./request.component.css'],
})

export class RequestSingleViewComponent  {
    @Input() requestData: LocalRequest;
    @Input() single = false;

    constructor(private _requestService: RequestService) {}

    get request (): LocalRequest {
        return this.requestData;
    }

    get starred (): boolean {
        return this.request.marker === RequestMarker.STARRED;
    }
    get hidden (): boolean {
        return this.request.marker === RequestMarker.HIDDEN;
    }

    get marker (): string {
        return RequestMarker[this.requestData.marker];
    }
    get status (): string {
        return RequestStatus[this.requestData.status];
    }

    setMarker (marker: RequestMarker): void {
        this._requestService.updateMarker(this.requestData.requestId, marker);
    }
    toggleStarredMarker (): void {
        if (this.requestData.marker === RequestMarker.STARRED) {
            this.setMarker(null);
        } else {
            this.setMarker(RequestMarker.STARRED);
        }
    }
    setHiddenMarker (): void {
        this.setMarker(RequestMarker.HIDDEN);
    }
}
