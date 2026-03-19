import {Component} from '@angular/core';
import {AgPromise, IHeaderParams} from 'ag-grid-community';
import {PatientReference} from '../../models/patient-reference';
import {IHeaderAngularComp} from 'ag-grid-angular';

/**
 * PatientReferenceHeaderComponent is an Angular component that serves as a custom header
 * for a grid, specifically designed to handle and display patient reference information.
 */
@Component({
    selector: 'patient-reference-header',
    templateUrl: './patient-reference-header.component.html',
    styleUrl: './patient-reference-header.component.css'
})
export class PatientReferenceHeaderComponent implements IHeaderAngularComp {
    private params: IHeaderParams;


    protected get reference(): PatientReference {
        // @ts-ignore
        return this.params?.reference;
    }

    refresh(params: IHeaderParams): boolean {
        this.params = params;

        return true;
    }

    agInit(params: IHeaderParams<any, any>): AgPromise<void> | void {
        this.params = params;
    }

}
