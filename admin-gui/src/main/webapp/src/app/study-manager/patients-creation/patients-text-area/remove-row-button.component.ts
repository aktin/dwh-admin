import {Component, EventEmitter, Output} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';

/**
 * RemoveRowButtonComponent is an Angular component that serves as a custom cell renderer for a grid,
 * specifically designed to handle and display a button that removes a row from the grid.
 */
@Component({
    selector: 'remove-row-button',
    templateUrl: './remove-row-button.component.html',
    styleUrl: './remove-row-button.component.css'
})
export class RemoveRowButtonComponent implements ICellRendererAngularComp {
    private params: ICellRendererParams;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        this.params = params;
        return true;
    }

    public removeRow(): void {
        // @ts-ignore
        this.params?.onRemove(this.params);
    }

}
