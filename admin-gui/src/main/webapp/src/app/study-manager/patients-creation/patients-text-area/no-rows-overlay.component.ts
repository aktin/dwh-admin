import {Component} from '@angular/core';
import {INoRowsOverlayAngularComp} from 'ag-grid-angular';
import {INoRowsOverlayParams} from 'ag-grid-community';

@Component({
    selector: 'no-rows-overlay',
    templateUrl: './no-rows-overlay.component.html',
    styleUrl: './no-rows-overlay.component.css'
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp {
    private params: INoRowsOverlayParams<any, any>;

    agInit(params: INoRowsOverlayParams<any, any>): void {
        this.refresh(params);
    }

    refresh?(params: INoRowsOverlayParams<any, any>): void {
        this.params = params;
    }

}
