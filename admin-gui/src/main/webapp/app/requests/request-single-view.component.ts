
/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ngx-pagination';

import { LocalRequest, RequestMarker, RequestStatus, Rule, QueryRuleAction, QueryBundle } from './request';
import { RequestSingleComponent } from './request-single.component';
import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';
import _ = require('underscore');

@Component({
    selector: 'request-single-view',
    templateUrl: './request-single-view.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestSingleViewComponent {
    @Input() requestData: LocalRequest;
    @Input() queryBundle: QueryBundle;
    @Input() queryDetails: object;
    @Input() single = false;
    @Input() popUp: PopUpMessageComponent = null;
    // requestsData = this._requestService.getRequests();
    // queryDetails: Object = this.queryDetails[this.request.queryId] = { 'order': [], 'rejected': 0, 'accepted': 0, 'submitted': 0 };
    hideSql = true;
    hiddenLoading = false;
    downloadLoading = false;
    options: string[];
    showQuery = false;
    // improve: avoid direct access to requestSingleComponent
    constructor(private _requestService: RequestService, private _requestSingleComponent: RequestSingleComponent) {
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

    isAuthorized(permission: string) {
        return this._requestService.checkPermission(permission);
    }

    setStatus(request: LocalRequest, allow: boolean, checkedAuto?: boolean): RequestStatus {
        return this._requestService.authorizeRequest(
            request.requestId,
            request.status,
            allow,
            checkedAuto,
        );
    }

    applyRule(checkedApply: boolean, action: QueryRuleAction) {
        if (checkedApply) {
            this._requestService.applyRule(this.request.queryId, action)
                .subscribe(() => { this._requestSingleComponent.updateQueryBundle() });
        }
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
                    'Vor der Übermittlung der Ergebnisse wird erneut nachgefragt.',
                    'Nach der Berechnung werden die Ergebnisse direkt übertragen.']);
                    if (this.request.isRecurring()) {
                        this.popUp.setOptQuery(['Serien-Freigabe',
                        'Nur diese Anfrage freigeben.', 'Diese und alle zukünftigen Anfragen der Serie freigeben.']);
                        let numAllow = this.getNumApplyRule();
                        if (numAllow > 0) {
                            this.popUp.setOptApply(
                            'Auch bereits bestehende Anfragen freigeben. ' +
                            'Anzahl der hiervon betroffenen Anfragen: ' + numAllow);
                        }
                        // this.popUp.setoptMail('E-Mail-Benachrichtigung nach der Übermittlung von Ergebnissen')
                    }
            } else {
                if (this.request.isRecurring()) {
                    this.popUp.setOptQuery(['Serien-Ablehnung',
                    'Nur diese Anfrage ablehnen.', 'Diese und alle zukünftigen Anfragen der Serie ablehnen.']);
                    let numReject = this.getNumApplyRule();
                    if (numReject > 0) {
                        this.popUp.setOptApply(
                            'Auch bereits bestehende Anfragen ablehnen. Anzahl der hiervon betroffenen Anfragen: '
                            + numReject);
                    }
                }
                buttons[0] = ['Jetzt ablehnen', 'red'];
            }
            this.popUp.setConfirm(buttons);
            this.popUp.setData(true, title, message,
                (answer: boolean, checkedAuto: boolean, checkedQuery: boolean, checkedApply: boolean, checkedMail: boolean) => {
                    // checkedQuery = this.request.isRecurring() && checkedQuery && (checkedAuto || !allow);
                    checkedQuery = this.request.isRecurring() && checkedQuery || !allow;
                    checkedApply = this.request.isRecurring() && checkedQuery && checkedApply;
                    if (answer) {
                        // set status of current request
                        if (!this.request.isRecurring() || !checkedQuery || !checkedApply) {
                            this.requestData.status = this.setStatus(this.requestData, allow, checkedAuto);
                        }
                        // query rule has to be set
                        if (checkedQuery) {
                            let newRuleAction: QueryRuleAction;
                            if (allow && !checkedAuto) {
                                newRuleAction = QueryRuleAction.ACCEPT_EXECUTE;
                            } else if (allow && checkedAuto) {
                                newRuleAction = QueryRuleAction.ACCEPT_SUBMIT;
                                if (checkedMail) {
                                    // TODO: set email flag
                                }
                            } else {
                                newRuleAction = QueryRuleAction.REJECT;
                            }
                            // delete old rule and create new one
                            if (this.queryRule && <QueryRuleAction> this.queryRule.action !== newRuleAction) {
                                this._requestService.deleteQueryRule(this.request.queryId).subscribe(resp => {
                                    this._requestService.setQueryRule(this.request.requestId, newRuleAction)
                                        .subscribe(res => {
                                            this.applyRule(checkedApply, newRuleAction);
                                        });
                                    });
                            } else if (!this.queryRule) { // no existing rule, create new one
                                this._requestService.setQueryRule(this.request.requestId, newRuleAction)
                                    .subscribe(res => {
                                        this.applyRule(checkedApply, newRuleAction);
                                    });
                            } else { // rule didn't change, apply rule to existing requests
                                this.applyRule(checkedApply, newRuleAction);
                            }
                        }
                    }
                });
        } else {
            let title = allow ? 'Ergebnisse der Anfrage freigeben:' : 'Senden der Ergebnisse ablehnen:';
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
                        this.requestData.status = this.setStatus(this.requestData, allow);
                    }
                });
        }
    }

    getNumApplyRule(): number {
        let reqId = this.requestData.requestId;
        let requests = this.queryBundle.requests.filter(function(req) {
            return req.requestId !== reqId &&
                  (req.status === RequestStatus.Retrieved ||
                   req.status === RequestStatus.Seen ||
                   req.status === RequestStatus.Queued ||
                   req.status === RequestStatus.Processing ||
                   req.status === RequestStatus.Completed);

        });
        return requests.length;
    }

    get queryRule() {
        if (this.queryBundle) {
            return this.queryBundle.rule;
        }
        return null;
    }

    deleteQueryRule() {
        return this._requestService.deleteQueryRule(this.request.queryId)
            .subscribe(() => { this._requestSingleComponent.updateQueryBundle()});
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

    getQueryDetails() {
        return this._requestSingleComponent.queryDetails;
    }

    get recurrRequests(): LocalRequest[] {
        return this.queryBundle.requests.slice().reverse();
    }

    formatXml(rawxml: string): string {
        let formatted = '';
        let xml = rawxml.replace(/(>)\s*(<)(\/*)/g, '$1\n$2$3');
        let pad = 0;
        let sql = 0;
        _.each(xml.split('\n'), function(rawnode, index) {
            let node = rawnode.trim();
            if (node === '') {
                return;
            }
            let indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }


            let padding = '';
            for (let i = 0; i < pad; i++) {
                padding += '      ';
            }
            if (! node.match(/<.*/)) {
                // its a sql sequence.
                if (sql !== 0) {
                    padding += '  ';
                } else {
                    padding = '\n' + padding;
                }
                if (node.match((/.*;$/))) {
                    sql = 0;
                } else {
                    sql ++;
                }
            }


            if (node.match( /.*<\/source>/ )) {
                formatted += '\n';
            }
            formatted += padding + node + '\n';

            pad += indent;

        });
        return formatted;
    }

    escapeXml (xml: string): string {
        return xml
            // .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/  /g, '&emsp;')
            .replace(/\n/g, '<br />');
    }

    downloadResult (): void {
        this.downloadLoading = true;
        this._requestService.downloadResultFile(this.requestData.requestId, this.requestData.result);
        setTimeout(() => { this.downloadLoading = false; }, 500);
    }

}
