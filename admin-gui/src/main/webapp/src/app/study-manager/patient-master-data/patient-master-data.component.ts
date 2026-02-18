import {Component, Input} from '@angular/core';
import {DateFormat, MomentDatePipe, TableColumns} from '../../helpers';
import {Encounter} from '../models/encounter';
import {MasterData} from '../models/master-data';
import moment from 'moment/moment';
import {Patient} from '../models/patient';
import {StudyManagerService} from '../services/study-manager.service';
import {defer, distinctUntilChanged, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {PatientValidationService} from '../services/patient-validation.service';
import {catchError, map} from 'rxjs/operators';
import {EntryValidation} from '../models/entry-validation';
import {Study} from '../models/study';

@Component({
    selector: 'patient-master-data',
    templateUrl: './patient-master-data.component.html',
    styleUrl: './patient-master-data.component.css'
})
export class PatientMasterDataComponent {
    @Input({required: true})
    public patient!: Patient;
    @Input({required: true})
    public study!: Study;

    /**
     * Observable that emits a boolean indicating whether the master data for the patient is available.
     */
    public readonly hasMasterData$: Observable<boolean> = defer(() => this.validationService.validationData$
    ).pipe(
        map(v => v?.find(e => e.extension === this.patient.extension)?.validationResults ?? []),
        map(results => !results.includes(EntryValidation.NoMasterdataFound)),
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true}),
        catchError(() => of(false))
    );

    /**
     * An observable that emits a boolean indicating whether encounters exist for a patient.
     */
    public readonly hasEncounters$: Observable<boolean> = defer(() =>
        this.validationService.validationData$
    ).pipe(
        map(v => v?.find(e => e.extension === this.patient.extension)?.validationResults ?? []),
        map(results => !results.includes(EntryValidation.NoEncountersFound)),
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true}),
        catchError(() => of(false))
    );

    /**
     * An observable that emits a list of encounters for a patient. Only loads encounters if valid encounters exist for the patient. See {@link hasEncounters$}.
     */
    public readonly encounters$: Observable<Encounter[]> = defer(() =>
        this.hasEncounters$
    ).pipe(
        switchMap(has =>
            has
                ? this.studyManagerService.getEncounters(this.study.id, this.patient.reference, [this.patient.extension])
                : of([])
        ),
        shareReplay({bufferSize: 1, refCount: true}),
        catchError(() => of([]))
    );

    protected readonly DateFormat = DateFormat;
    protected masterData: MasterData;
    /**
     * An observable that emits the master data for a patient. Only loads master data if valid encounters exist for the patient. See {@link hasEncounters$}.
     */
    public readonly masterData$: Observable<MasterData | null> = defer(() =>
        this.hasMasterData$
    ).pipe(
        switchMap(has =>
            has
                ? this.studyManagerService.getMasterData(this.study.id, this.patient.reference, [this.patient.extension])
                    .pipe(map(m => m?.find(() => true)))
                : of(null)
        ),
        tap(m => (this.masterData = m)),
        shareReplay({bufferSize: 1, refCount: true}),
        catchError(() => of(null))
    );
    protected encounterColumns: TableColumns<Encounter> = [
        {
            field: e => new MomentDatePipe().transform(e.startDate, DateFormat.DATETIME),
            header: 'Aufnahmezeitpunkt',
            useToTrack: true
        },
        {field: e => new MomentDatePipe().transform(e.endDate, DateFormat.DATETIME), header: 'Entlassungszeitpunkt'},
        {
            field: e => `${moment.unix(e.startDate).diff(moment.unix(this.masterData?.birthDate), 'years')}`,
            header: 'Alter bei Aufnahme'
        }
    ];

    constructor(private studyManagerService: StudyManagerService,
                private validationService: PatientValidationService,) {
    }
}
