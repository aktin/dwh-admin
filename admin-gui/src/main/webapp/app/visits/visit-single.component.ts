
import {map} from 'rxjs/operators';
/**
 * Created by Xu on 15.05.2017.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Visit } from './visit';
import { VisitService } from './visit.service';
@Component({
    templateUrl: './visit-single.component.html',
})
export class VisitSingleComponent implements OnInit {
    visitData: Visit;
    patId: string;
    root: string;

    constructor(
        private _route: ActivatedRoute,
        private _visitService: VisitService
    ) {}

    ngOnInit(): void {
        this._route.params.pipe(
            map((params: Params) => {
                this.patId = params['patId'];
                this.root = params['root'];
                return this._visitService.getVisit(params['root'], params['patId']);
            })).subscribe(
                visit => {
                    this.visitData = visit;
                }
            );
    }

    get visit (): Visit {
        if (!this.visitData) {
            this.visitData = this._visitService.getVisit(this.root, this.patId);
        }
        return this.visitData;
    }
}
