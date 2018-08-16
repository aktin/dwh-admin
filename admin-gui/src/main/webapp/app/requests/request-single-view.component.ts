
/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input, OnInit } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ngx-pagination';

import { LocalRequest, RequestMarker, RequestStatus, Rule, QueryRuleAction, QueryBundle } from './request';
import { PopUpMessageComponent } from '../helpers/index';
import { RequestService } from './request.service';
import _ = require('underscore');

@Component({
    selector: 'request-single-view',
    templateUrl: './request-single-view.component.html',
    styleUrls: ['./requests.component.css'],
})

export class RequestSingleViewComponent implements OnInit {
    @Input() requestData: LocalRequest;
    @Input() single = false;
    @Input() popUp: PopUpMessageComponent = null;
    requestsData = this._requestService.getRequests();
    queryDetails = {};
    hideSql = true;
    hiddenLoading = false;
    downloadLoading = false;
    options: string[];
    showQuery = false;
    queryBundle: QueryBundle;

    constructor(private _requestService: RequestService) {
        let tempOpt = Object.keys(RequestStatus);
        this.options = tempOpt.slice(tempOpt.length / 2);
    }

    ngOnInit() {
        // improve: wait for async call updateQueryBundle to finish before loading content
        if (this.request.isRecurring()) {
            this.queryDetails[this.request.queryId] = { 'order': [], 'rejected': 0, 'accepted': 0, 'submitted': 0 };
            this.updateQueryBundle();
        }
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

    setStatus(request: LocalRequest, allow: boolean, checked?: boolean): RequestStatus {
        return this._requestService.authorizeRequest(
            request.requestId,
            request.status,
            allow,
            checked,
        );
    }

    updateQueryBundle() {
        this._requestService.getQueryBundle(this.request.queryId)
            .subscribe(res => { this.queryBundle = res; this.queryDetails[this.request.queryId] = this.updateQueryDetails(); });
    }

    applyRule(checkedApply: boolean, action: QueryRuleAction) {
        if (checkedApply) {
            this._requestService.applyRule(this.request.queryId, action)
                .subscribe(() => { this.updateQueryBundle() });
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
                        'Nur diese Anfrage freigeben.', 'Alle Anfragen dieser Serie freigeben.']);
                        this.popUp.setOptApply(['',
                        'Freigabe-Regel nur auf alle zukünftigen Anfragen anwenden.',
                        'Freigabe von allen zukünftigen und bereits bestehenden Anfragen. Hiervon sind '
                        + this.getNumApplyRule() + ' Anfragen betroffen.']);
                    }
            } else {
                if (this.request.isRecurring()) {
                    message += ' Nur Anfragen, die noch nicht ausgeführt wurden, werden hierdurch abgelehnt.';
                    this.popUp.setOptQuery(['Serien-Ablehnung',
                    'Nur diese Anfrage ablehnen.', 'Alle Anfragen dieser Serie ablehnen.']);
                    this.popUp.setOptApply(['',
                        'Nur alle zukünftigen Anfragen ablehnen.',
                        'Alle zukünftigen und bereits bestehenden Anfragen ablehnen. Hiervon sind '
                        + this.getNumApplyRule() + ' Anfragen betroffen.']);
                }
                buttons[0] = ['Jetzt ablehnen', 'red'];
            }
            this.popUp.setConfirm(buttons);
            this.popUp.setData(true, title, message,
                (answer: boolean, checked: boolean, checkedQuery: boolean, checkedApply: boolean) => {
                    if (answer) {
                        if (this.request.isRecurring() && checkedQuery) {
                            if (checked && allow) {
                                if (this.queryRule &&  this.queryRule.action.toString() !== 'ACCEPT_SUBMIT') {
                                    this._requestService.deleteQueryRule(this.request.queryId).subscribe(resp => {
                                        this._requestService.setQueryRule(this.request.requestId, QueryRuleAction.ACCEPT_SUBMIT)
                                            .subscribe(res => {
                                                this.applyRule(checkedApply, QueryRuleAction.ACCEPT_SUBMIT);
                                            });
                                        });
                                } else if (!this.queryRule) {
                                    this._requestService.setQueryRule(this.request.requestId, QueryRuleAction.ACCEPT_SUBMIT)
                                        .subscribe(res => {
                                            this.applyRule(checkedApply, QueryRuleAction.ACCEPT_SUBMIT);
                                       });
                                }
                            // } else if (!checked && allow) {
                            //     console.log("set QueryRule: Execute");
                            //     this._requestService.setQueryRule(this.request.queryId, this.request.requestId,
                            //         QueryRuleAction.ACCEPT_EXECUTE);
                            } else if (!allow) {
                                if (this.queryRule && this.queryRule.action.toString() !== 'REJECT') {
                                    this._requestService.deleteQueryRule(this.request.queryId).subscribe(() => {
                                        this._requestService.setQueryRule(this.request.requestId, QueryRuleAction.REJECT)
                                            .subscribe(res => {
                                                this.applyRule(checkedApply, QueryRuleAction.REJECT);
                                            });
                                    });
                                } else if (!this.queryRule) {
                                    this._requestService.setQueryRule(this.request.requestId, QueryRuleAction.REJECT)
                                        .subscribe(res => {
                                            this.applyRule(checkedApply, QueryRuleAction.REJECT);
                                        });
                                }
                            }
                        } else {
                            this.requestData.status = this.setStatus(this.requestData, allow, checked);
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
        let requests = this.queryBundle.requests.filter(function(req) {
            return req.status === RequestStatus.Retrieved ||
                   req.status === RequestStatus.Seen ||
                   req.status === RequestStatus.Queued ||
                   req.status === RequestStatus.Processing ||
                   req.status === RequestStatus.Completed;

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
            .subscribe(() => this.updateQueryBundle());
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
        return this.queryDetails;
    }

    updateQueryDetails() {
        let query = this.queryBundle.requests;
        let order: number[] = [];
        query.forEach(request => {
            order.push(request.requestId);
        });
        let rejected = query.filter(
            req => req.status === RequestStatus.Rejected).length;
        let accepted = query.filter(
            req => req.status !== RequestStatus.Retrieved &&  req.status !== RequestStatus.Seen
                &&  req.status !== RequestStatus.Rejected).length;
        let submitted = query.filter(
            req => req.status === RequestStatus.Submitted).length;
        return { 'order': order, 'rejected': rejected, 'accepted': accepted, 'submitted': submitted };
    }

    get recurrRequests(): LocalRequest[] {
        return this.queryBundle.requests;
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
        setTimeout(() => {this.downloadLoading = false;}, 500);
    }

}
