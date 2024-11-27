import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {SortableTableColumnDirective} from "./sortable-table-column/sortable-table-column.directive";
import {SortEvent} from "./sortable-table-column/sort-event";

@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.css'
})
export class DataTableComponent<T = any> {
    @Input()
    public columns: TableColumns<T>;
    public allData: T[];
    @Output()
    public onDetailsClick: EventEmitter<T> = new EventEmitter();
    @ViewChildren(SortableTableColumnDirective)
    private sortableColumns: QueryList<SortableTableColumnDirective>;

    @Input()
    public showDetailButtons: boolean = true;

    @Input()
    public set data(data: T[]) {
        this.resetSorts();
        this.allData = data;
    }

    public sort($event: SortEvent): void {
        this.resetSorts($event.identifier);

        if (!this.allData?.length) return;

        let sortFunction: (a: any, b: any) => number;

        // identifier is the header
        const column = this.columns.find(c => c.header === $event.identifier);
        const resolvedField = this.resolveField(column.field, this.allData[0]);

        switch (typeof resolvedField) {
            case "boolean":
                sortFunction = (a: boolean, b: boolean) => {
                    if (a === b) return 0;
                    else if (a) return 1;
                    else return -1;
                };
                break;
            case "bigint":
            case "number":
                sortFunction = (a: number, b: number) => a - b;
                break;
            case "string":
                sortFunction = (a: string, b: string) => a.localeCompare(b);
                break;
            case "function":
            case "symbol":
            case "undefined":
            case "object":
            default:
                sortFunction = () => 0;
        }

        sortFunction = column.sort ?? sortFunction;

        const reversed = $event.direction === "ascending" ? 1 : -1;

        this.allData = this.allData.sort((a: any, b: any) => sortFunction(this.resolveField(column.field, a), this.resolveField(column.field, b)) * reversed);

    }

    protected resolveField(field: string | number | symbol | ((obj: any) => string), obj: any): any {
        return typeof field === "function" ? field(obj) : obj[field];
    }

    public resetSorts(identifierToIgnore?: string): void {
        this.sortableColumns?.filter(c => c.identifier !== identifierToIgnore).forEach(c => c.direction = null);
    }

    public p: number;

    protected onButtonClick(row: T): void {
        this.onDetailsClick.emit(row);
    }

    protected determineTrackBy(row: T): any {
        const column = this.columns.find(c => c.useToTrack);
        if (!column) return row;
        return this.resolveField(column.field, row);
    }
}

export interface TableColumn<T> {
    header: string;
    field: keyof T | string | ((obj: T) => string);
    sort?: (a: any, b: any) => number;
    useToTrack?: boolean;
}

export type TableColumns<T> = TableColumn<T>[];
