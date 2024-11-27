/**
 * Created by Xu on 09-Jun-17.
 */
import {Component, Input} from '@angular/core';
import {Visit} from './visit';

@Component({
    selector: 'visit-single-view',
    templateUrl: './visit-single-view.component.html',
    styleUrls: ['./visits.component.css'],
})

export class VisitSingleViewComponent  {
    @Input() visitData: Visit;
    @Input() root: string;
    @Input() patId: string;

    constructor() {
    }

    get visit (): Visit {
        return this.visitData;
    }
}
