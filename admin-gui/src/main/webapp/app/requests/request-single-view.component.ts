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
    starLoading = false;
    hiddenLoading = false;

    constructor(private _requestService: RequestService) {}

    get request (): LocalRequest {
        return this.requestData;
    }

    get starred (): boolean {
        return this.requestData.marker === RequestMarker.STARRED;
    }
    get hidden (): boolean {
        return this.requestData.marker === RequestMarker.HIDDEN;
    }
    get starMessage (): string {
        if (this.starred) {
            return 'Anfrage nicht mehr favorisieren';
        } else {
            return 'Anfrage favorisieren';
        }
    }
    get hideMessage (): string {
        if (this.hidden) {
            return 'Anfrage wiederherstellen';
        } else {
            return 'Anfrage löschen';
        }
    }

    get marker (): string {
        return RequestMarker[this.requestData.marker];
    }
    get status (): string {
        return RequestStatus[this.requestData.status];
    }

    toggleStarredMarker (): void {
        this.starLoading = true;
        let newMark = this.requestData.marker;
        if (newMark === RequestMarker.STARRED) {
            newMark = null;
        } else {
            newMark = RequestMarker.STARRED;
        }
        this._requestService.updateMarker(this.requestData.requestId, newMark);
        setTimeout(() => {
            this.starLoading = false;
        }, 500);
    }
    toggleHiddenMarker (): void {
        this.hiddenLoading = true;
        let newMark = this.requestData.marker;
        if (newMark === RequestMarker.HIDDEN) {
            newMark = null;
        } else {
            newMark = RequestMarker.HIDDEN;
        }
        this._requestService.updateMarker(this.requestData.requestId, newMark);
        setTimeout(() => {
            this.starLoading = false;
        }, 500);
    }
}
