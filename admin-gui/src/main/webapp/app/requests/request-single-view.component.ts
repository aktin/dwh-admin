
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
    @Input() requestDataUnmapped: LocalRequest;
    @Input() queryBundle: QueryBundle;
    @Input() queryDetails: object;
    @Input() single = false;
    @Input() popUp: PopUpMessageComponent = null;
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

    get requestUnmapped (): LocalRequest {
        return this.requestDataUnmapped;
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
            return 'Anfrage archivieren';
        }
    }

    get status (): string {
        return RequestStatus[this.requestData.status];
    }

    /**
     * Checks if the user has the given permission.
     * @param permission The permission that will be checked.
     * @returns true if user has the permission, false otherwise
     */
    isAuthorized(permission: string) {
        return this._requestService.checkPermission(permission);
    }

    /**
     * Sets the next possible status of the given request depending on the current status, whether the request was accepted or rejected and
     * whether auto submit was selected.
     * @param request The request whose status will be set.
     * @param allow Wheteher the request was accepted or rejected.
     * @param checkedAuto Optional: Wheteher auto submit was selected.
     */
    setStatus(request: LocalRequest, allow: boolean, checkedAuto?: boolean): RequestStatus {
        return this._requestService.authorizeRequest(
            request.requestId,
            request.status,
            allow,
            checkedAuto,
        );
    }

    /**
     * Apply the selected rule (reject, accept_execute or accept_submit) to all request (including the current one)
     * of the belonging series which don't have a final status yet. After that the query bundle is updated.
     */
    applyRule(checkedApply: boolean, action: QueryRuleAction) {
        if (checkedApply) {
            this._requestService.applyRule(this.request.queryId, action)
                .subscribe(() => { this._requestSingleComponent.updateQueryBundle() });
        }
    }

    /**
     * Set popup content and the callback function depending on the selected options.
     * @param allow True if request is accepted, false if request is rejected.
     */
    authorize (allow: boolean) {
        if (this.request.isNew()) {
            let title = allow ? 'Anfrage freigeben' : 'Anfrage ablehnen';
            let message = allow ? 'Bitte bestätigen Sie, dass diese Anfrage ausgeführt werden darf. '
                : 'Bitte bestätigen Sie, dass diese Anfrage abgelehnt werden soll. ' +
                'Dieser Schritt kann nicht rückgängig gemacht werden.';
            let button = ['checkmark icon', 'Jetzt freigeben', 'green'];
            if (allow) {    // ACCEPT
                this.popUp.setOptIn(['Ergebnisprüfung vor der Übermittlung', 'Die Ergebnisse der Abfrage werden nach der Durchführung sofort übertragen.']);
                    if (this.request.isRecurring()) {
                        this.popUp.setOptQuery(['Serien-Freigabe', 'Diese und alle zukünftigen Anfragen der Serie freigeben.']);
                        let numAllow = this.getNumApplyRule();
                        if (numAllow > 0) {
                            this.popUp.setOptApply(
                            'Auch bereits bestehende Anfragen freigeben. Anzahl der hiervon betroffenen Anfragen: ' + numAllow);
                        }
                    }
            } else {    // REJECT
                button = ['icon remove', 'Jetzt ablehnen', 'red'];
                if (this.request.isRecurring()) {
                    this.popUp.setOptQuery(['Serien-Ablehnung', 'Diese und alle zukünftigen Anfragen der Serie ablehnen.']);
                    let numReject = this.getNumApplyRule();
                    if (numReject > 0) {
                        this.popUp.setOptApply(
                            'Auch bereits bestehende Anfragen ablehnen. Anzahl der hiervon betroffenen Anfragen: ' + numReject);
                    }
                }
            }
            this.popUp.setConfirm(button);
            this.popUp.setData(true, title, message,
                // answer: whether the dialog options are submitted; checkedAuto: whether auto submit is selected; checkedQuery: whether a
                // rule for the series should be created; checkedApply: whether the rule should be applied to already existing requests
                (answer: boolean, checkedAuto: boolean, checkedQuery: boolean, checkedApply: boolean) => {
                    if (answer) {
                        checkedApply = this.request.isRecurring() && checkedQuery && checkedApply;
                        checkedQuery = this.request.isRecurring() && checkedQuery;
                        // set status of current request
                        if (!this.request.isRecurring() || !checkedQuery || !checkedApply) {
                            this.requestData.status = this.setStatus(this.requestData, allow, checkedAuto);
                        }
                        // set query rule
                        if (checkedQuery) {
                            let newRuleAction: QueryRuleAction;
                            if (allow && !checkedAuto) {
                                newRuleAction = QueryRuleAction.ACCEPT_EXECUTE;
                            } else if (allow && checkedAuto) {
                                newRuleAction = QueryRuleAction.ACCEPT_SUBMIT;
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
        } else { // accept or reject sending the results to broker
            let title = allow ? 'Ergebnisse der Anfrage freigeben:' : 'Senden der Ergebnisse ablehnen:';
            let message = allow ? 'Bitte bestätigen Sie, dass die Ergebnisse der Anfrage an den zentralen Server übertragen werden dürfen.'
                : 'Bitte bestätigen Sie, dass die Anfrage abgelehnt werden soll. Es werden keine Ergebnisse übermittelt. ' +
                'Dieser Schritt kann nicht rückgängig gemacht werden.';
            let button = ['checkmark icon', 'Jetzt freigeben', 'green'];
            if (!allow) {
                button = ['icon remove', 'Jetzt ablehnen', 'red'];
            }
            this.popUp.setConfirm(button);
            this.popUp.setData(true, title, message,
                (answer: boolean) => {
                    if (answer) {
                        this.requestData.status = this.setStatus(this.requestData, allow);
                    }
                });
        }
    }

    /**
     * Counts the number of requests to which the selected rule can be applied in the current series (excluding the current request),
     * hence the number of requests which don't have a final status.
     * @returns number of requests without final status of current series (excluding current request)
     */
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

    /**
     * Returns the rule of the current series.
     * @returns query rule
     */
    get queryRule() {
        if (this.queryBundle) {
            return this.queryBundle.rule;
        }
        return null;
    }

    /**
     * Deletes the rule of the current series and updates the query bundle.
     * @returns subscription
     */
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

    /**
     * Returns the query details, e.g. order of request in the current series and how many of them have been accepted or rejected.
     * @returns query details
     */
    getQueryDetails() {
        return this._requestSingleComponent.queryDetails;
    }

    /**
    * Returns the position of the request inside the belonging series (ordered by reference date).
    * @returns position of request in the belonging series
    */
    getNumRequest(request: LocalRequest): number {
        return this.getQueryDetails()[request.queryId].order.indexOf(request.requestId) + 1;
    }

    /**
     * Returns all requests of current series in reversed order.
     * @returns requests of current series
     */
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
