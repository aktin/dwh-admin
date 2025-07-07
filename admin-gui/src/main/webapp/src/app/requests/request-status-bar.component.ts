/**
 * Created by Xu on 09-Jun-17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {LocalRequest, RequestStatus} from './request';

@Component({
    selector: 'request-status-bar',
    templateUrl: './request-status-bar.component.html',
    styleUrls: ['./request-status-bar.component.less'],
})

export class RequestStatusBarComponent implements OnInit {
    @Input() interaction: boolean;
    failed: boolean;
    expired: boolean;
    rejected: boolean;
    submitted: boolean;
    statusBarProgress: string;
    itemsInStatusBar: any = null;
    oldStatus: RequestStatus;
    public readonly statusLabels: Record<RequestStatus, string> = {
        [RequestStatus.Retrieved]: 'Anfrage eingegangen',
        [RequestStatus.Seen]: 'Anfrage prüfen',
        [RequestStatus.Queued]: 'Ausführung geplant',
        [RequestStatus.Processing]: 'Anfrage wird ausgeführt',
        [RequestStatus.Completed]: 'Ergebnisse freigeben',
        [RequestStatus.Sending]: 'Übermittlung der Ergebnisse',
        [RequestStatus.Submitted]: 'Übermittlung abgeschlossen',
        [RequestStatus.Failed]: 'Anfrage fehlgeschlagen',
        [RequestStatus.Rejected]: 'Anfrage abgelehnt',
        [RequestStatus.Expired]: 'Anfrage geschlossen'
    };
    public readonly statusStepOrder: Record<RequestStatus, number> = {
        [RequestStatus.Retrieved]: 0,
        [RequestStatus.Seen]: 1,
        [RequestStatus.Queued]: 2,
        [RequestStatus.Processing]: 3,
        [RequestStatus.Completed]: 4,
        [RequestStatus.Sending]: 5,
        [RequestStatus.Submitted]: 6,
        [RequestStatus.Failed]: 6,
        [RequestStatus.Rejected]: 6,
        [RequestStatus.Expired]: 6
    };
    private readonly statusBarStepsNum = 7;

    private _request: LocalRequest;

    get request(): LocalRequest {
        return this._request;
    }

    @Input()
    set request(value: LocalRequest) {
        this._request = value;
        this.calcView();
    }

    get items() {
        return this.itemsInStatusBar;
    }

    private get statusStepOrderReverted() {
        return Object.entries(this.statusStepOrder).reduce((previousValue, currentValue) => {
            const [step, order] = currentValue;
            if (!previousValue[order]?.length) {
                previousValue[order] = [];
            }
            previousValue[order].push(<RequestStatus>step);
            return previousValue;
        }, {} as Record<number, RequestStatus[]>);
    }

    calcView() {
        if (this.request && this.oldStatus !== this.request.status) {
            this.oldStatus = this.request.status;

            this.statusBarProgress = this.statusStepOrder[this.request.status] / (this.statusBarStepsNum - 1) * 100 + '%';

            this.itemsInStatusBar = Array(this.statusBarStepsNum).fill({}).map((_, step) => {
                // each step has one status, except for the last one
                const statusesForSteps = this.statusStepOrderReverted[step];
                const status = {
                    // default to the first status per step
                    title: this.statusLabels[statusesForSteps[0]],
                    visited: step < this.statusStepOrder[this.request.status],
                    dot: true,
                    active: false,
                    interaction: false,
                    waiting: false
                };
                if (statusesForSteps.includes(this.request.status)) {
                    // for the active step, use the actual status set in the request object
                    status.title = this.statusLabels[this.request.status];
                    status.active = true;
                    switch (this.request.status) {
                        case RequestStatus.Retrieved:
                            status.dot = true;
                            break;
                        case RequestStatus.Seen:
                        case RequestStatus.Completed:
                            status.interaction = true;
                            status.dot = false;
                            break;
                        case RequestStatus.Queued:
                        case RequestStatus.Processing:
                        case RequestStatus.Sending:
                            status.waiting = true;
                            status.dot = false;
                            break;
                        default:
                            status.dot = false;
                    }

                    status[this.request.status] = true;
                }
                return status;
            });
        }
    }

    ngOnInit() {
        this.failed = this.request.status === RequestStatus.Failed;
        this.expired = this.request.status === RequestStatus.Expired;
        this.submitted = this.request.status === RequestStatus.Submitted;
        this.rejected = this.request.status === RequestStatus.Rejected;
    }
}
