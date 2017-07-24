/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input }     from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';

@Component({
    selector: 'request-single-view',
    templateUrl: './request-single-view.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestSingleViewComponent  {
    @Input() requestData: LocalRequest;
    @Input() single = false;
    @Input() popUp: PopUpMessageComponent = null;
    starLoading = false;
    hiddenLoading = false;
    options: string[];

    constructor(private _requestService: RequestService) {
        let tempOpt = Object.keys(RequestStatus);
        this.options = tempOpt.slice(tempOpt.length / 2);
    }

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

    get status (): string {
        return RequestStatus[this.requestData.status];
    }

    updateStatus (statusIndex: number): void {
        console.log(statusIndex, <RequestStatus> statusIndex);
        this.requestData.status = this._requestService.updateStatus(this.requestData.requestId, <RequestStatus> statusIndex);
    }

    authorize (allow: boolean) {
        let title = allow ? 'Anfrage freigeben:' : 'Anfrage ablehnen:';
        let message = allow ? 'Diese Anfrage wird freigegeben.'
            : 'Diese Anfrage wird abgelehnt und entsprechende Antwort an den Server versendet.';
        this.popUp.setConfirm();
        this.popUp.setData(true, title, message,
            (answer: boolean) => {
                if (answer) {
                    this.requestData.status = this._requestService.authorizeRequest(
                        this.requestData.requestId,
                        this.requestData.status,
                        allow
                    );
                }
            } );
    }

    toggleStarredMarker (): void {
        this.starLoading = true;
        let newMark = this.requestData.marker;
        if (newMark === RequestMarker.STARRED) {
            newMark = null;
        } else {
            newMark = RequestMarker.STARRED;
        }
        this.requestData.marker = newMark;
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
        this.requestData.marker = newMark;
        this._requestService.updateMarker(this.requestData.requestId, newMark);
        setTimeout(() => {
            this.hiddenLoading = false;
        }, 500);
    }
}
