import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {compareStudies, Study} from '../models/study';
import {Patient} from '../models/patient';
import {PatientReference} from '../models/patient-reference';
import {Participation} from '../models/participation';
import {NgForm} from '@angular/forms';
import {SICGeneration} from '../models/sic-generation';
import {PatientDialogBase} from '../models/patient-dialog-base';
import {StudyManagerService} from '../services/study-manager.service';
import {NotificationService} from '../../helpers';
import {PatientReferenceToRootPipe} from '../helpers/patient-reference-to-root.pipe';
import {IModalConfig, MODAL_CONFIG} from '../../helpers/modal/modal.service';
import {ModalRef} from '../../helpers/modal/modal-ref.component';
import {PatientValidationService} from '../services/patient-validation.service';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StudyManagerErrorInterceptor} from "../helpers/study-manager-error.interceptor";

/**
 * The `PatientCreationComponent` is a component designed for managing the creation and registration
 * of patients in the application. It provides functionality for selecting studies, validating input,
 * and saving new patient data.
 */
@Component({
    selector: 'patient-creation',
    templateUrl: './patient-creation.component.html',
    styleUrls: ['./patient-creation.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientReferenceToRootPipe,
        PatientValidationService,
        {provide: HTTP_INTERCEPTORS, useClass: StudyManagerErrorInterceptor, multi: true},
    ]
})
export class PatientCreationComponent extends PatientDialogBase implements OnInit {
    public studies: Study[] = [];
    public patient: Patient = new Patient();
    public references: PatientReference[] = [PatientReference.Patient, PatientReference.Encounter, PatientReference.Billing];
    protected readonly SICGeneration = SICGeneration;
    protected readonly compareStudies = compareStudies;
    protected readonly Participation = Participation;
    @ViewChild(NgForm)
    private form: NgForm;

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService,
                @Inject(MODAL_CONFIG) config: IModalConfig<any>,
                private modalRef: ModalRef<PatientCreationComponent>,
                private patientValidationService: PatientValidationService,) {
        super(studyManagerService);
        this.selectedStudy = config.data.study;
    }

    private _selectedStudy: Study;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    public set selectedStudy(value: Study) {
        this._selectedStudy = value;

        if (!!value) {
            this.patient.participation = value.participation;

            this.patient.generateSic = this._selectedStudy.sicGeneration === SICGeneration.AutoAndManual;
        }
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
        this.studyManagerService.getStudies().subscribe(s => this.studies = s);
    }

    public validate(): void {
        this.patientValidationService.validatePatients(this.selectedStudy.id, [this.patient]);
    }

    public create(): void {
        if (this.form.valid) {
            this.studyManagerService.createPatients(this.selectedStudy.id, [this.patient])
                .subscribe({
                    next: e => {
                        this.notificationService.showSuccess('Patient*in registriert');
                        this.close();
                    },
                    error: e => this.notificationService.showError(`Patient*in konnte nicht registriert werden.`)
                });
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben');
        }
    }

    public close(): void {
        this.modalRef.close(this.selectedStudy);
    }
}
