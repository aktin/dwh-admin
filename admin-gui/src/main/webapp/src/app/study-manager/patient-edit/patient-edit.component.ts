import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Participation} from '../models/participation';
import {DateFormat, MY_CALENDAR_OPTIONS, NotificationService, PopUpMessageComponent} from '../../helpers';
import {PatientDialogBase} from '../models/patient-dialog-base';
import {Patient} from '../models/patient';
import {NgForm} from '@angular/forms';
import {StudyManagerService} from '../services/study-manager.service';
import {IModalConfig, MODAL_CONFIG, ModalService} from '../../helpers/modal/modal.service';
import {ModalRef} from '../../helpers/modal/modal-ref.component';
import {iif, of, switchMap, tap} from 'rxjs';
import {Study} from '../models/study';
import {PatientValidationService} from '../services/patient-validation.service';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StudyManagerErrorInterceptor} from "../helpers/study-manager-error.interceptor";

declare var $: any;

@Component({
    selector: 'patient-edit',
    templateUrl: './patient-edit.component.html',
    styleUrls: ['./patient-edit.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientValidationService,
        {provide: HTTP_INTERCEPTORS, useClass: StudyManagerErrorInterceptor, multi: true},]
})
export class PatientEditComponent extends PatientDialogBase implements OnInit {
    public entry: Patient;
    @ViewChild(NgForm)
    private form: NgForm;

    protected readonly Participation = Participation;
    protected readonly DateFormat = DateFormat;
    protected study: Study;

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService,
                private modalService: ModalService,
                private modalRef: ModalRef<PatientEditComponent>,
                @Inject(MODAL_CONFIG) config: IModalConfig) {
        super(studyManagerService);
        this.entry = config.data.patient;
        this.study = config.data.study
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
    }

    public save(): void {
        if (this.form.valid) {
            this.studyManagerService.updatePatient(this.study.id, this.entry.reference, this.entry.extension, this.entry)
                .subscribe({
                    next: e => {
                        this.notificationService.showSuccess('Änderungen gespeichert');
                        this.close();
                    },
                    error: e => this.notificationService.showError(`Änderungen konnten nicht gespeichert werden. ${e.readable}`)
                });
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben');
        }
    }

    public confirmDelete(): void {
        this.modalService.open(PopUpMessageComponent)
            .pipe(tap(ref => {
                    // ref.instance.onClose.subscribe(r => ref.close(r));
                    ref.instance.button = ['user minus icon icon', 'Löschen', 'primary'];
                    ref.instance.head = 'Eintrag löschen';
                    ref.instance.message = 'Möchten Sie den Eintrag unwideruflich löschen?';
                    ref.instance.mode = 'confirm';
                    ref.instance.show = true;
                }), switchMap(ref => ref.closed$),
                switchMap(shouldDelete => iif(() => shouldDelete,
                    this.studyManagerService.deletePatient(this.study.id, this.entry.reference, this.entry.extension),
                    of(false)
                )))
            .subscribe({
                next: wasDeleted => {
                    //explicit false check because deleteEntry returns null
                    if (wasDeleted !== false) {
                        this.notificationService.showSuccess('Eintrag gelöscht');
                        this.close();
                    }
                }, error: e => this.notificationService.showError('Eintrag konnte nicht gelöscht werden')
            });
    }

    public close(): void {
        this.modalRef.close();
    }
}
