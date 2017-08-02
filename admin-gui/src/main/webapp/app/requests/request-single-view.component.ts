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
    hideSql = true;
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
            return 'Anfrage aus den Favoriten entfernen';
        } else {
            return 'Anfrage zu Favoriten hinzufügen';
        }
    }
    get hideMessage (): string {
        if (this.hidden) {
            return 'Anfrage wiederherstellen';
        } else {
            return 'Anfrage ausblenden';
        }
    }

    get status (): string {
        return RequestStatus[this.requestData.status];
    }

    authorize (allow: boolean) {
        if (this.request.isNew()) {
            let title = allow ? 'Anfrage freigeben:' : 'Anfrage ablehnen:';
            let message = allow ? 'Bitte bestätigen Sie, dass die Anfrage ausgeführt werden darf. '
                : 'Bitte bestätigen Sie, dass die Anfrage abgelehnt werden soll. ' +
                'Dieser Schritt kann nicht rückgängig gemacht werden.';
            let buttons = [['Jetzt freigeben', 'green'], ['Zurück', 'orange']];
            if (allow) {
                this.popUp.setOptIn(['Ergebnisprüfung vor der Übermittlung',
                    'Vor der Übermittlung der Ergebnisse wird erneut nachgefragt',
                    'Nach der Berechnung werden die Ergebnisse direkt übertragen']);
            } else {
                buttons[0] = ['Jetzt ablehnen', 'red'];
            }
            this.popUp.setConfirm(buttons);
            this.popUp.setData(true, title, message,
                (answer: boolean, checked?: boolean) => {
                    if (answer) {
                        this.requestData.status = this._requestService.authorizeRequest(
                            this.requestData.requestId,
                            this.requestData.status,
                            allow,
                            checked
                        );
                    }
                } );
        } else {
            let title = allow ? 'Ergebnise der Anfrage freigeben:' : 'Senden der Ergebnise ablehnen:';
            let message = allow ? 'Bitte bestätigen Sie, dass die Ergebnisse der Anfrage an den zentralen Server übertragen werden dürfen.'
                : 'Bitte bestätigen Sie, dass die Anfrage abgelehnt werden soll. Es werden keine Ergebnisse übermittelt. ' +
                'Dieser Schritt kann nicht rückgängig gemacht werden.';
            let buttons = [['Jetzt freigeben', 'green'], ['Zurück', 'orange']];
            if (!allow) {
                buttons[0] = ['Jetzt ablehnen', 'red'];
            }
            this.popUp.setConfirm(buttons);
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
