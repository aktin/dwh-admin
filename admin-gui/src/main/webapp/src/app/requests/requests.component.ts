/**
 * Created by Xu on 04.05.2017.
 */
import {Component, OnInit} from '@angular/core';

import {RequestService} from './request.service';
import {LocalRequest, RequestStatus} from './request';
import {BehaviorSubject, race, Subject, switchMap, takeUntil, tap, timer} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {RequestFilterPipe} from './request-filter.pipe';
import {ModalService} from '../helpers/modal/modal.service';
import {RequestSingleComponent} from './request-single.component';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ModalRef} from '../helpers/modal/modal-ref.component';

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.less'],
    providers: [RequestFilterPipe]
})
export class RequestsComponent implements OnInit {
    p: number;
    etag = '0';
    status: RequestStatus = null;
    stateFilter: RequestStatus | string = 'auth';
    timeoutBool = false;
    /**
     * array of arrays which have the following values: the shown text, the belonging state
     * and substates of the same form (or null if no substates are available)
     */
    public readonly stateFilterArray: FilterOptions[] = [
        {label: 'Alle anzeigen', value: 'all'},
        {label: 'Aktion erforderlich', value: 'auth'},
        {label: 'Neue Anfragen', value: 'new'},
        {label: 'Einzelanfragen', value: 'single'},
        {label: 'Serien-Anfragen', value: 'recurring'},
        {label: 'Archivierte Anfragen', value: 'hidden'},
        {
            label: 'Laufende Anfragen', optGroups: [
                {label: 'Alle laufenden Anfragen', value: 'inProgress'},
                {label: 'Eingegangen (neue Anfragen)', value: 'retrieved'},
                {label: 'Freigabe der Abfrage', value: 'seen'},
                {label: 'Ausführung geplant', value: 'queued'},
                {label: 'Ausführung läuft', value: 'processing'},
                {label: 'Freigabe der Ergebnisse', value: 'completed'},
            ]
        }, {
            label: 'Abgeschlossene Anfragen', optGroups: [
                {label: 'Alle abgeschlossenen Anfragen', value: 'done'},
                {label: 'Übermittlung abgeschlossen', value: 'submitted'},
                {label: 'Abgelehnt', value: 'rejected'},
                {label: 'Fehlgeschlagen', value: 'failed'},
                {label: 'Geschlossen', value: 'expired'},
            ]
        }
    ];
    public filteredRequests: LocalRequest[] = [];
    public groupedRequests: GroupedRequests[] = [];
    private _dataInterval = 5000;
    private _dataTimeout = 30000;
    private _foundRequests$: Subject<void> = new Subject<void>();
    private modal$: BehaviorSubject<ModalRef<RequestSingleComponent>> = new BehaviorSubject<ModalRef<RequestSingleComponent>>(null);

    constructor(private _requestService: RequestService,
                private _requestFilterPipe: RequestFilterPipe,
                private _modalService: ModalService,
                private _location: Location,
                private _activatedRoute: ActivatedRoute,) {
    }

    private _requests: LocalRequest[];

    public get requests(): LocalRequest[] {
        return this._requests;
    }

    public set requests(value: LocalRequest[]) {
        this._requests = value;

        this.groupRequests();
    }

    ngOnInit() {
        const reqId = this._activatedRoute.snapshot.params['id'];
        if (!!reqId) {
            this.openRequestView(reqId);
        }
        this.loadRequests();
    }

    public loadRequests() {
        this.timeoutBool = false;
        // get requests every {this._dataInterval} ms until either {this._dateTimeout} runs out or getRequests returns a non-empty array
        timer(0, this._dataInterval)
            .pipe(switchMap(() => this._requestService.getRequests(this.etag)),
                takeUntil(race(timer(this._dataTimeout), this._foundRequests$)),
                finalize(() => this.timeoutBool = true),)
            .subscribe(res => {
                this.requests = res['req'];
                this.etag = res['etag'];
                if (!!this.requests?.length) {
                    this.filterRequests(this.stateFilter);
                    this._foundRequests$.next();
                }
            });
    }

    public setRoute(reqId?: number): void {
        const route = reqId ? `/request/${reqId}` : '/request';
        this._location.go(route);
    }

    public openRequestView(reqId: number): void {
        this.setRoute(reqId);

        this._modalService.open(RequestSingleComponent, {data: {reqId: reqId}})
            .pipe(tap(ref => this.modal$.next(ref)),
                switchMap(ref => ref.closed$),)
            .subscribe(() => {
                this.setRoute();
            });
    }

    public filterRequests(filter: RequestStatus | string): void {
        this.stateFilter = filter;
        this.filteredRequests = this._requestFilterPipe.transform(this._requests, this.stateFilter);

        this.groupRequests();
    }

    public groupRequests(): void {
        this.groupedRequests = this.filteredRequests.reduce((acc, curr) => {
            let group = null;
            if (curr.isRecurring()) {
                group = acc.find(g => g.queryId === curr.queryId);
            }

            if (!group) {
                group = new GroupedRequests(curr.queryId, [curr]);
                acc.push(group);
            } else {
                group.requests.push(curr);
            }

            return acc;
        }, [] as GroupedRequests[]).sort((a, b) => b.requestId - a.requestId);
    }
}

class GroupedRequests {
    public page: number = 0;

    constructor(public queryId: number, public requests: LocalRequest[]) {
    }

    public get sortedRequests(): LocalRequest[] {
        return this.requests.sort((a, b) => b.requestId - a.requestId);
    }

    public get latestRequest(): LocalRequest {
        return this.sortedRequests[0];
    }

    public get previousRequests(): LocalRequest[] {
        return this.sortedRequests.slice(1);
    }

    public get requestId(): number {
        return this.latestRequest.requestId;
    }

    changePage($event: number) {
        this.page = $event;
    }
}

interface FilterOptions {
    label: string;
    value?: RequestStatus | string;
    optGroups?: FilterOptions[];
}