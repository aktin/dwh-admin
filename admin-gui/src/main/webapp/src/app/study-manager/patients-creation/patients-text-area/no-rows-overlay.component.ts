import {Component} from '@angular/core';
import {INoRowsOverlayAngularComp} from 'ag-grid-angular';
import {INoRowsOverlayParams} from 'ag-grid-community';
import {PatientReference} from '../../models/patient-reference';

/**
 * A component that serves as a custom overlay in place of rows when there is
 * no data to display in an ag-Grid table.
 */
@Component({
    selector: 'no-rows-overlay',
    templateUrl: './no-rows-overlay.component.html',
    styleUrl: './no-rows-overlay.component.css'
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp {
    private params: INoRowsOverlayParams<any, any>;
    protected get reference(): PatientReference {
        // @ts-ignore
        return this.params?.reference;
    }

    agInit(params: INoRowsOverlayParams<any, any>): void {
        this.refresh(params);
    }

    refresh?(params: INoRowsOverlayParams<any, any>): void {
        this.params = params;
    }

}
