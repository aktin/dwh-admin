import { Component } from '@angular/core';

import { Visit } from './visit';
import { VisitService } from './visit.service';

@Component({
    templateUrl: './visits.component.html',
    styleUrls: ['./visits.component.css'],
})
export class VisitsComponent {
    root: string = '1.2.276.0.76.3.87686';
    encounterId: string = '2017091050';
    _visitData: Visit = null;

    constructor (private _fileService: VisitService) {}

    search (): void {
        console.log(this.root, this.encounterId);
        this._visitData = this._fileService.getVisit(this.root, this.encounterId);
    }

    get visit () {
        if (this._visitData)
            console.log(this._visitData.root, this._visitData.encounterId);
        return this._visitData;
    }
}


