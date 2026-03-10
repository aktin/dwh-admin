import {Component, DestroyRef, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    ControlValueAccessor,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';
import {ColDef, GridApi, GridReadyEvent, ICellRendererParams} from 'ag-grid-community';
import {Observable, of, switchMap, tap} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {determineSeverity, EntryValidation} from '../../models/entry-validation';
import {PatientReference} from '../../models/patient-reference';
import {RemoveRowButtonComponent} from './remove-row-button.component';
import {DateFormat, MomentDatePipe} from '../../../helpers';
import {ReadableEntryValidationPipe} from './readable-entry-validation.pipe';
import {NoRowsOverlayComponent} from './no-rows-overlay.component';
import {PatientReferenceToLabelPipe} from '../../helpers/patient-reference-to-label.pipe';
import {PatientReferenceHeaderComponent} from './patient-reference-header.component';
import {PatientValidationService} from '../../services/patient-validation.service';
import {Patient} from '../../models/patient';
import {StudyManagerService} from '../../services/study-manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StudyManagerErrorInterceptor} from "../../helpers/study-manager-error.interceptor";
import {ExternalTriggeredAsyncValidatorBase} from "../../helpers/external-triggered-async-validator-base";

/**
 * Represents a text area component designed to manage and edit patient data in a tabular format.
 * This component integrates with Angular forms and provides asynchronous validation, grid manipulation, and dynamic data handling.
 *
 * The component leverages AG Grid to display and edit patient information with customizable columns,
 * including features such as row addition and deletion, automatic resizing, and conditional column visibility.
 *
 */
@Component({
    selector: 'patients-text-area',
    templateUrl: './patients-text-area.component.html',
    styleUrl: './patients-text-area.component.less',
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: PatientsTextAreaComponent, multi: true},
        {provide: NG_ASYNC_VALIDATORS, useExisting: PatientsTextAreaComponent, multi: true},
        ReadableEntryValidationPipe,
        MomentDatePipe,
        PatientReferenceToLabelPipe,
        {provide: HTTP_INTERCEPTORS, useClass: StudyManagerErrorInterceptor, multi: true},],
    encapsulation: ViewEncapsulation.None
})
export class PatientsTextAreaComponent extends ExternalTriggeredAsyncValidatorBase implements ControlValueAccessor, OnInit {
    public columnDefs: ColDef<Patient>[] = [
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
            field: 'validationResults',
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
    protected defaultColDef: ColDef<Patient> = {
        cellClassRules: {
            'static-cell': params => !params.colDef.editable,
        },
        cellClass: params => determineSeverity(params.node.data.validationResults),
    };
    protected readonly NoRowsOverlayComponent = NoRowsOverlayComponent;
    private gridApi: GridApi<Patient>;
    private isDisabled: boolean;

    constructor(private patientValidationService: PatientValidationService,
                private readableEntryValidationPipe: ReadableEntryValidationPipe,
                private studyManagerService: StudyManagerService,
                private momentDatePipe: MomentDatePipe,
                private destroyRef: DestroyRef) {
        super();
    }

    private _reference: PatientReference;

    public get reference(): PatientReference {
        return this._reference;
    }

    @Input()
    public set reference(value: PatientReference) {
        this._reference = value;

        this.rowData?.forEach(r => r.reference = this.reference);

        const colDef = this.columnDefs.find(c => c.field === 'extension');
        colDef.headerComponentParams = {reference: this.reference};

        this.gridApi?.setGridOption('columnDefs', this.columnDefs);

        this.patientValidationService.requestRevalidation();
    }

    private _rowData: Patient[] = [];

    public get rowData(): Patient[] {
        return this._rowData;
    }

    public set rowData(value: Patient[]) {
        this._rowData = value;
        this.rowData?.forEach>(r => r.reference = this.reference);

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

    ngOnInit(): void {
        this.reactToExternalChanges(this.patientValidationService.revalidate$);

        /**
         * observables load encounters and master data for all patients who have encounters and master data available respectively
         * using a bulk call avoids possible tens or hundreds of single calls (1 per patient)
         */
        this.patientValidationService.validationData$
            .pipe(map(patients => patients?.filter(e => !e.validationResults.includes(EntryValidation.NoEncountersFound))),
                filter(patients => !!patients?.length),
                switchMap(patients => this.studyManagerService.getEncounters(this.reference, patients.map(p => p.extension))),
                takeUntilDestroyed(this.destroyRef),)
            .subscribe(encounters => {
                this.rowData.forEach(row => row.encounters = encounters.filter(e => e.ide === row.ide));

                this.gridApi?.refreshCells({force: true});
            });

        this.patientValidationService.validationData$
            .pipe(map(patients => patients?.filter(e => !e.validationResults.includes(EntryValidation.NoMasterdataFound))),
                filter(patients => !!patients?.length),
                switchMap(patients => this.studyManagerService.getMasterData(this.reference, patients.map(p => p.extension))),
                takeUntilDestroyed(this.destroyRef),)
            .subscribe(masterData => {
                this.rowData.forEach(row => row.masterData = masterData.find(m => m.ide === row.ide));

                this.gridApi?.refreshCells({force: true});
            });
    }

    @HostListener('document:paste', ['$event'])
    public onPaste(event: ClipboardEvent): void {
        //prevent dataloss when user wants to paste text into a single cell or input element
        if (!(document.activeElement instanceof HTMLInputElement)) {
            const clipboardData = event.clipboardData;
            const pastedText = clipboardData.getData('text');
            this.rowData = this.parseExcelData(pastedText);
            this.onChange(this.rowData);
        }
    }

    public onGridReady(params: GridReadyEvent<Patient>): void {
        this.gridApi = params.api;
        this.gridApi.setGridOption('loading', false);
        this.gridApi.applyColumnState({state: [{colId: 'sic', hide: this.generateSic}]});
        this.gridApi?.autoSizeAllColumns();
    }

    public resizeGrid(): void {
        this.gridApi?.autoSizeAllColumns();
    }

    writeValue(value: Patient[]): void {
        this._rowData = value;
    }

    registerOnChange(fn: (value: Patient[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    /**
     * Validates the given control based on patient entry validation logic.
     *
     * @param {AbstractControl} control The form control to be validated.
     * @return {Promise<ValidationErrors | null> | Observable<ValidationErrors | null>}
     *         A promise or observable emitting validation errors if any, or null if the control is valid or disabled.
     */
    public validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        if (control.disabled) {
            return of(null);
        }

        return this.patientValidationService.validatePatients$(this.studyId, this.rowData)
            .pipe(map(result => result.map(r => {
                    if (r.extension) return r;

                    r.validationResults = [EntryValidation.PatientReferenceMissing];

                    return r;
                })),
                tap(v => this.rowData = v ?? this.rowData),
                map(result => (result?.flatMap(r => r.validationResults).every(r => [EntryValidation.NoMasterdataFound,
                    EntryValidation.NoEncountersFound].includes(r))
                    ? null
                    : {entries: result}))

            );
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
        this.rowData = [...this.rowData, new Patient({extension: '', validationResults: [EntryValidation.Pending]})];
    }

    /**
     * Parses Excel data from a string and converts it into an array of Patient objects.
     *
     * @param {string} data - The input Excel data as a tab-separated string. Each row is expected to be separated by a newline.
     * @return {Patient[]} An array of Patient objects created by processing each row of the input data.
     */
    private parseExcelData(data: string): Patient[] {
        const rows = data.split('\n')
            .filter(r => !!r?.length);//omit empty rows

        let mapFunc: (r: string) => Patient;
        // if sic won't be generated, add a row for optionally entering a sic
        if (!this.generateSic) {
            mapFunc = row => {
                const cells = row.split('\t');
                return new Patient({extension: cells[0], sic: cells[1], validationResults: [EntryValidation.Pending]});
            };
        } else {
            mapFunc = row => new Patient({extension: row, validationResults: [EntryValidation.Pending]});
        }

        return rows.map(mapFunc);
    }

    private removeRow(event: ICellRendererParams) {
        this.rowData = this.rowData.filter((_, i) => i !== event.node.rowIndex);
        this.onChange(this.rowData);
    }

    private onChange: (value: Patient[]) => void = () => {
    };

    private onTouched: () => void = () => {
    };
}
