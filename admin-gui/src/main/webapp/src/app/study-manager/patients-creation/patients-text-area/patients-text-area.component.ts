import {Component, HostListener, Input, ViewEncapsulation} from '@angular/core';
import {StudyManagerService} from '../../study-manager.service';
import {
    AbstractControl,
    AsyncValidator,
    ControlValueAccessor,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';
import {ColDef, GridApi, GridReadyEvent, ICellRendererParams} from 'ag-grid-community';
import {distinctUntilChanged, Observable, of, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {EntryValidation} from './entry-validation';
import {PatientReference} from '../../patient-reference';
import {RemoveRowButtonComponent} from './remove-row-button.component';
import {MasterData} from '../../master-data';
import {Encounter} from '../../encounter';
import {DateFormat, MomentDatePipe} from '../../../helpers';
import {ReadableEntryValidationPipe} from './readable-entry-validation.pipe';
import {NoRowsOverlayComponent} from './no-rows-overlay.component';
import {PatientReferenceToLabelPipe} from '../../patient-reference-to-label.pipe';
import {PatientReferenceHeaderComponent} from './patient-reference-header.component';

@Component({
    selector: 'patients-text-area',
    templateUrl: './patients-text-area.component.html',
    styleUrl: './patients-text-area.component.scss',
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: PatientsTextAreaComponent, multi: true},
        {provide: NG_ASYNC_VALIDATORS, useExisting: PatientsTextAreaComponent, multi: true},
        ReadableEntryValidationPipe,
        MomentDatePipe,
        PatientReferenceToLabelPipe,],
    encapsulation: ViewEncapsulation.None
})
export class PatientsTextAreaComponent implements ControlValueAccessor, AsyncValidator {
    public columnDefs: ColDef<GridModel>[] = [
        {
            headerName: 'Entfernen',
            cellRenderer: RemoveRowButtonComponent,
            cellRendererParams: {onRemove: this.removeRow.bind(this)},
        },
        {
            headerComponent: PatientReferenceHeaderComponent,
            headerComponentParams: {reference: this.reference},
            field: 'extension',
            editable: true
        },
        {headerName: 'Studien-ID', field: 'sic', editable: true, initialHide: this.generateSic},
        {
            headerName: 'Status',
            field: 'entryValidation',
            valueFormatter: v => this.readableEntryValidationPipe.transform(v.value, this.reference)
        },
        {
            headerName: 'Geburtstag',
            valueGetter: v => v.data.masterData?.birthDate,
            valueFormatter: v => this.momentDatePipe.transform(v.value, DateFormat.DATE),
        },
        {headerName: 'Geschlecht', valueGetter: v => v.data.masterData?.sex},
        {headerName: 'PLZ', valueGetter: v => v.data.masterData?.zip},
        {
            headerName: 'Letzter Fall',
            valueGetter: v => v.data.lastEncounter?.startDate,
            valueFormatter: v => `${this.momentDatePipe.transform(v.value, DateFormat.DATETIME)} - ${this.momentDatePipe.transform(v.data.lastEncounter?.endDate, DateFormat.DATETIME)}`,
        },
    ];
    @Input()
    public studyId: string;
    @Input()
    public root: string;
    protected defaultColDef: ColDef<GridModel> = {
        cellClassRules: {
            'static-cell': params => !params.colDef.editable,
            'error': params => ![EntryValidation.Pending, EntryValidation.Valid].includes(params.node.data.entryValidation),
            'warn': params => [EntryValidation.NoMasterdataFound, EntryValidation.NoEncountersFound].includes(params.node.data.entryValidation),
            'success': params => params.node.data.entryValidation === EntryValidation.Valid
        }
    };
    protected readonly NoRowsOverlayComponent = NoRowsOverlayComponent;
    private gridApi: GridApi<GridModel>;
    private isDisabled: boolean;

    constructor(private studyManagerService: StudyManagerService,
                private readableEntryValidationPipe: ReadableEntryValidationPipe,
                private momentDatePipe: MomentDatePipe) {
    }

    private _reference: PatientReference;

    public get reference(): PatientReference {
        return this._reference;
    }

    @Input()
    public set reference(value: PatientReference) {
        this._reference = value;

        const colDef = this.columnDefs.find(c => c.field === 'extension');
        colDef.headerComponentParams = {reference: this.reference};

        this.gridApi?.setGridOption('columnDefs', this.columnDefs);
    }

    private _rowData: GridModel[] = [];

    public get rowData(): GridModel[] {
        return this._rowData;
    }

    public set rowData(value: GridModel[]) {
        this._rowData = value;

        this.gridApi?.setGridOption('rowData', value);
        this.gridApi?.autoSizeAllColumns();
    }

    private _generateSic: boolean = true;

    public get generateSic(): boolean {
        return this._generateSic;
    }

    @Input()
    public set generateSic(value: boolean) {
        this._generateSic = value;

        this.gridApi?.applyColumnState({state: [{colId: 'sic', hide: value}]});
        this.rowData = [];
        this.onChange(this.rowData);
    }

    @HostListener('document:paste', ['$event'])
    public onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        this.rowData = this.parseExcelData(pastedText);
        this.onChange(this.rowData);
    }

    public onGridReady(params: GridReadyEvent<GridModel>): void {
        this.gridApi = params.api;
        this.gridApi.setGridOption('loading', false);
        this.gridApi.applyColumnState({state: [{colId: 'sic', hide: this.generateSic}]});
        this.gridApi?.autoSizeAllColumns();
    }

    writeValue(value: GridModel[]): void {
        this._rowData = value;
    }

    registerOnChange(fn: (value: GridModel[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    public validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        if (control.disabled) {
            return of(null);
        }

        return this.studyManagerService.validateEntries(this.studyId, this._reference, this.root, control.value, this.generateSic)
                   .pipe(distinctUntilChanged(),
                       tap(r => this.rowData = r),
                       map(result => (result.every(r => [EntryValidation.Valid,
                           EntryValidation.NoMasterdataFound,
                           EntryValidation.NoEncountersFound].includes(r.entryValidation))
                           ? null
                           : {entries: result})));
    }

    public invokeValidation(): void {
        // invokes angular validation
        this.onChange(this.rowData);
    }

    public clearEntries(): void {
        this.rowData = [];
        this.onChange(this.rowData);
    }

    public addRow(): void {
        if (!this.rowData) {
            this.rowData = [];
        }
        //add new row this way instead of Array.push to trigger the ag grid update
        this.rowData = [...this.rowData, {extension: '', entryValidation: EntryValidation.Pending}];
    }

    private parseExcelData(data: string): GridModel[] {
        const rows = data.split('\n')
                         .filter(r => !!r?.length);//omit empty rows

        let mapFunc: (r: string) => GridModel;
        if (!this.generateSic) {
            mapFunc = row => {
                const cells = row.split('\t');
                return {extension: cells[0], sic: cells[1], entryValidation: EntryValidation.Pending};
            };
        } else {
            mapFunc = row => ({extension: row, entryValidation: EntryValidation.Pending});
        }

        return rows.map(mapFunc);
    }

    private removeRow(event: ICellRendererParams) {
        this.rowData = this.rowData.filter((_, i) => i !== event.node.rowIndex);
        this.onChange(this.rowData);
    }

    private onChange: (value: GridModel[]) => void = () => {
    };

    private onTouched: () => void = () => {
    };
}

export interface GridModel {
    sic?: string;
    extension: string;
    masterData?: MasterData;
    lastEncounter?: Encounter;
    entryValidation?: EntryValidation;
}
