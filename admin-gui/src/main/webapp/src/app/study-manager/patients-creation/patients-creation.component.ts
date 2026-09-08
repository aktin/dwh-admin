import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {PatientDialogBase} from '../models/patient-dialog-base';
import {compareStudies, Study} from '../models/study';
import {PatientReference} from '../models/patient-reference';
import {NgForm} from '@angular/forms';
import {StudyManagerService} from '../services/study-manager.service';
import {NotificationService, PopUpMessageComponent} from '../../helpers';
import {Participation} from '../models/participation';
import {SICGeneration} from '../models/sic-generation';
import {PatientReferenceToRootPipe} from '../helpers/patient-reference-to-root.pipe';
import {ModalRef} from '../../helpers/modal/modal-ref.component';
import {IModalConfig, MODAL_CONFIG, ModalService} from '../../helpers/modal/modal.service';
import {Patient} from '../models/patient';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StudyManagerErrorInterceptor} from "../helpers/study-manager-error.interceptor";
import {filter, Observable, of, switchMap, tap} from "rxjs";
import {determineSeverity, EntryValidation} from "../models/entry-validation";

declare var $: any;

@Component({
    selector: 'patients-creation',
    templateUrl: './patients-creation.component.html',
    styleUrls: ['./patients-creation.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientReferenceToRootPipe,
        {provide: HTTP_INTERCEPTORS, useClass: StudyManagerErrorInterceptor, multi: true},]
})
export class PatientsCreationComponent extends PatientDialogBase implements OnInit {
    public studies: Study[] = [];
    public extension: string;
    public selectedReference: PatientReference = PatientReference.Patient;
    public references: PatientReference[] = [PatientReference.Patient, PatientReference.Encounter, PatientReference.Billing];
    public generateSic: boolean = false;
    protected readonly SICGeneration = SICGeneration;
    protected readonly compareStudies = compareStudies;

    public entries: Patient[];

    @ViewChild(NgForm)
    private form: NgForm;
    public participation: Participation;
    public comment: string;

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService,
                private modalService: ModalService,
                private modalRef: ModalRef<PatientsCreationComponent>,
                @Inject(MODAL_CONFIG) config: IModalConfig<any>,) {
        super(studyManagerService);
        this.selectedStudy = config.data.study;
    }

    private _selectedStudy: Study;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    public get isPending(): boolean {
        return this.entries?.some(r => r.validationResults?.includes(EntryValidation.Pending));
    }

    @Input()
    public set selectedStudy(value: Study) {
        this._selectedStudy = value;

        if (!!value) {
            this.participation = value.participation;

            this.generateSic = this._selectedStudy.sicGeneration === SICGeneration.AutoAndManual;
        }
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
        this.studyManagerService.getStudies().subscribe(s => this.studies = s);
    }

    public close() {
        this.modalRef.close(this.selectedStudy);
    }

    public create(): void {
        if (this.form.valid) {
            // only show confirm dialog if there are entries with warnings, otherwise just create
            let hasConfirmed$: Observable<boolean>;
            if(this.entries?.some(e => determineSeverity(e.validationResults) === "warn")) {
                hasConfirmed$ = this.openConfirmDialog();
            } else {
                hasConfirmed$ = of(true);
            }

            hasConfirmed$.pipe(
                filter(Boolean),
                switchMap(() => this.performCreate()))
                .subscribe({
                    next: e => {
                        this.notificationService.showSuccess('Patient*innen registriert');
                        this.close();
                    },
                    error: e => this.notificationService.showError(`Patient*innen konnten nicht registriert werden.`)
                });
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben');
        }
    }

    private performCreate(): Observable<void> {
        // populate every patient with the same reference and participation
        this.entries?.forEach(e => {
            e.reference = this.selectedReference;
            e.participation = this.participation;
            e.comment = this.comment;
            e.generateSic = this.generateSic;
        });
        return this.studyManagerService.createPatients(this.selectedStudy.id,
            this.entries);
    }

    private openConfirmDialog(): Observable<boolean> {
        return this.modalService.open(PopUpMessageComponent).pipe(
            tap(ref => {
                ref.instance.button = ['checkmark icon', 'Registrieren', 'primary'];
                ref.instance.head = 'Patient*innen registrieren';
                ref.instance.message = 'Es existiert mind. ein Eintrag mit Warnungen. ' +
                    'Sind Sie sicher, diese Einträge zu registrieren? ' +
                    'Sie können später nur einzeln gelöscht werden.';
                ref.instance.mode = 'confirm';
                ref.instance.show = true;
            }),
            switchMap(ref => ref.closed$)
        );
    }

    protected readonly Participation = Participation;
}
