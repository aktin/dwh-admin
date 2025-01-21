import {Component, EventEmitter, Output} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';

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
