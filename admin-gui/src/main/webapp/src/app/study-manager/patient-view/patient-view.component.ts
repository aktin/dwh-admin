import {Component, Inject, OnInit} from '@angular/core';
import {Patient} from "../models/patient";
import {PatientDialogBase} from "../models/patient-dialog-base";
import {DateFormat} from "../../helpers";
import {StudyManagerService} from "../services/study-manager.service";
import {Participation} from "../models/participation";
import {PatientReferenceToRootPipe} from "../helpers/patient-reference-to-root.pipe";
import {ModalRef} from '../../helpers/modal/modal-ref.component';
import {IModalConfig, MODAL_CONFIG, ModalService} from '../../helpers/modal/modal.service';
import {PatientEditComponent} from '../patient-edit/patient-edit.component';
import {Study} from '../models/study';
import {PatientValidationService} from '../services/patient-validation.service';

declare var $: any;

@Component({
    selector: 'patient-view',
    templateUrl: './patient-view.component.html',
    styleUrls: ['./patient-view.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientReferenceToRootPipe,
    PatientValidationService]
})
export class PatientViewComponent extends PatientDialogBase implements OnInit {
    protected readonly DateFormat = DateFormat;
    protected readonly Participation = Participation;
    protected study: Study;

    constructor(studyManagerService: StudyManagerService,
                private modalService: ModalService,
                private modalRef: ModalRef<PatientViewComponent>,
                @Inject(MODAL_CONFIG) config: IModalConfig) {
        super(studyManagerService);
        this.entry = config.data.patient;
        this.study = config.data.study;
    }

    protected entry: Patient;


    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
    }

    public openPatientEditModal(): void {
        this.modalService.open(PatientEditComponent, {data: {patient: this.entry, study: this.study}})
            .subscribe(() => this.modalRef.close());
    }

    public close(): void {
        this.modalRef.close();
    }

    protected readonly self = self;
}
