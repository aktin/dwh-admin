/**
 * Created by Xu on 04.05.2017.
 */
import { Component } from '@angular/core';

import { RequestService } from './request.service';

@Component({
    template: `<h1>Hello Anfragen</h1>`,
})
export class RequestsComponent  {
    constructor(private _requestService: RequestService) {
        this._requestService.getRequests();
    }
}
