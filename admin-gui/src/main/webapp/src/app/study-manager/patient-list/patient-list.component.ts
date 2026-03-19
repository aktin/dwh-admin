import {AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {compareStudies, Study} from '../models/study';
import {Patient} from '../models/patient';
import {MomentDatePipe, MY_CALENDAR_RANGE_OPTIONS, TableColumns} from '../../helpers';
import {StudyManagerService} from '../services/study-manager.service';
import {AngularMyDatePickerDirective, IMyDateModel, IMyOptions} from 'gramli-angular-mydatepicker';
import moment from 'moment';
import {PatientReferenceToLabelPipe} from '../helpers/patient-reference-to-label.pipe';
import {ModalService} from '../../helpers/modal/modal.service';
import {PatientCreationComponent} from '../patient-creation/patient-creation.component';
import {switchMap} from 'rxjs';
import {PatientsCreationComponent} from '../patients-creation/patients-creation.component';
import {PatientViewComponent} from '../patient-view/patient-view.component';
import {PatientValidationService} from '../services/patient-validation.service';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StudyManagerErrorInterceptor} from "../helpers/study-manager-error.interceptor";

declare var $: any;

@Component({
    selector: 'patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.css',
    providers: [PatientReferenceToLabelPipe,
        PatientValidationService,
        {provide: HTTP_INTERCEPTORS, useClass: StudyManagerErrorInterceptor, multi: true},]
})
export class PatientListComponent implements OnInit, AfterViewInit {
    public studies: Study[] = [];
    public patients: Patient[] = [];
    public filteredPatients: Patient[] = [];
    public columns: TableColumns<Patient> = [
        {
            field: e => new MomentDatePipe().transform(e.timestamp, 'DD.MM.YYYY, HH:mm'),
            header: 'Datum'
        },
        {
            field: 'sic',
            header: 'Studien-ID'
        },
        {
            field: e => e.extension,
            header: 'Patient*innen-Referenz',
            useToTrack: true
        },
        {
            field: e => this.patientReferenceToLabelPipe.transform(e.reference),
            header: 'Referenzart',
            useToTrack: true
        },
        {
            field: 'participationString',
            header: 'Teilnahme'
        },
        {
            field: 'comment',
            header: 'Kommentar'
        }];
    protected readonly compareStudies = compareStudies;
    protected date: IMyDateModel;
    protected search: string = '';
    @ViewChild(AngularMyDatePickerDirective)
    private datePicker: AngularMyDatePickerDirective;
    @ViewChild('batchAddDropdown')
    private batchAddDropdown: ElementRef<HTMLDivElement>;

    constructor(private studyManagerService: StudyManagerService,
                private patientReferenceToLabelPipe: PatientReferenceToLabelPipe,
                private modalService: ModalService,
                @Inject(MY_CALENDAR_RANGE_OPTIONS) protected options: IMyOptions) {
    }

    private _selectedStudy: Study = null;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    public set selectedStudy(value: Study) {
        this._selectedStudy = value;
        if (!!value) {
            this.loadPatients();
        }
    }

    ngAfterViewInit(): void {
        $(this.batchAddDropdown.nativeElement).dropdown();
        this.resetFilter();
    }

    ngOnInit(): void {
        this.studyManagerService.getStudies()
            .subscribe(studies => {
                this.studies = studies;
                this.selectedStudy = this.studies[0];
            });

        // update patient list whenever a dialog is closed
        this.modalService.modalClosed$.subscribe(() => this.loadPatients());
    }

    /**
     * Filters the patients list based on the specified date or date range.
     * If a date range is provided, it filters patients whose timestamps fall within the range (inclusive).
     * If a single date is provided, it filters patients with timestamps matching the specified date.
     * If no date is provided, the full patients list is retained.
     *
     * @return {void} This method does not return any value; it modifies the `filteredPatients` property in place.
     */
    public filter(): void {
        this.filteredPatients = this.patients;
        if (!!this.date) {
            let filterFunc: (e: Patient) => boolean;
            if (this.date.isRange) {
                // '[]' to include begin date and end date
                // https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/
                filterFunc = e => moment.unix(e.timestamp).isBetween(this.date.dateRange.beginJsDate, this.date.dateRange.endJsDate, 'day', '[]');
            } else {
                filterFunc = e => moment.unix(e.timestamp).isSame(this.date.singleDate.jsDate, 'day');
            }
            this.filteredPatients = this.filteredPatients.filter(filterFunc);
        }
    }

    public resetFilter(): void {
        this.datePicker.clearDate();
        this.search = '';
        this.filter();
    }

    public loadPatients(): void {
        this.studyManagerService.getEntries(this.selectedStudy.id).subscribe(e => {
            this.patients = e;
            this.filter();
        });
    }

    public openPatientCreationModal(): void {
        this.modalService.open(PatientCreationComponent, {data: {study: this.selectedStudy}})
            .pipe(switchMap(ref => ref.closed$))
            .subscribe(r => this.selectedStudy = <Study>r);
    }

    public openPatientsCreationModal(): void {
        this.modalService.open(PatientsCreationComponent, {data: {study: this.selectedStudy}})
            .pipe(switchMap(ref => ref.closed$))
            .subscribe(r => this.selectedStudy = <Study>r);
    }

    public openPatientViewModal(entry: Patient): void {
        this.modalService.open(PatientViewComponent, {data: {patient: entry, study: this.selectedStudy}})
            .subscribe();
    }
}
