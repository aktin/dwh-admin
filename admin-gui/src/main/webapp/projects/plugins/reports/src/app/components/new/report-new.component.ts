import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {State, UrlService} from "@aktin/utils";
import {Store} from "@ngrx/store";
import {ReportService} from "../../services";

@Component({
    selector: 'admin-gui-report-new',
    templateUrl: "./report-new.component.html",
    styles: []
})
export class ReportNewComponent implements OnInit {
    
    constructor(
        private _route: ActivatedRoute,
        private _url: UrlService,
        private _store: Store<State>,
        private s: ReportService,
    ) { }
    
    ngOnInit() {
    }
    
}
