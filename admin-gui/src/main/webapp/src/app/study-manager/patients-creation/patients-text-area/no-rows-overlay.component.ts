import {Component} from '@angular/core';
import {INoRowsOverlayAngularComp} from 'ag-grid-angular';
import {INoRowsOverlayParams} from 'ag-grid-community';
import {PatientReference} from '../../models/patient-reference';

type PatientNoRowsOverlayParams = INoRowsOverlayParams<any, any> & {
    reference?: PatientReference;
    filtered?: boolean;
};

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
    private params: PatientNoRowsOverlayParams;
    protected readonly isFirefox = /firefox/i.test(navigator.userAgent);

    protected get reference(): PatientReference {
        return this.params?.reference;
    }

    protected get filtered(): boolean {
        return this.params?.filtered ?? false;
    }

    agInit(params: PatientNoRowsOverlayParams): void {
        this.refresh(params);
    }

    refresh?(params: PatientNoRowsOverlayParams): void {
        this.params = params;
    }

}
