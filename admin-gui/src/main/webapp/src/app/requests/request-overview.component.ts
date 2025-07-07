import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LocalRequest, RequestMarker} from './request';

@Component({
    selector: 'request-overview',
    templateUrl: './request-overview.component.html',
    styleUrl: './request-overview.component.scss'
})
export class RequestOverviewComponent {
    @Input()
    public request: LocalRequest;

    @Input()
    public requestSeries: LocalRequest[];

    @Input()
    public compact: boolean = false;
    @Output()
    public onDetailsClick: EventEmitter<LocalRequest> = new EventEmitter<LocalRequest>();
    protected readonly RequestMarker = RequestMarker;

    public get numInSeries(): number {
        const index = this.requestSeries?.findIndex(req => req.requestId === this.request.requestId) ?? 0;
        // console.log(`Id: ${this.request.queryId}, Index: ${index + 1}, Anfrage:`, this.request, this.requestSeries)
        return this.requestSeries.length - index;
    }
}
