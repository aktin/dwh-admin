/**
 * Created by Xu on 09-Jun-17.
 */
import { Component, Input }     from '@angular/core';
import { LocalRequest } from './request';

@Component({
    selector: 'request-single-view',
    templateUrl: './request-single-view.component.html',
    // styleUrls: ['./request.component.css'],
})

export class RequestSingleViewComponent  {
    @Input() requestData: LocalRequest;
    @Input() single = false;

    constructor() {}

    get request (): LocalRequest {
        return this.requestData;
    }
}
