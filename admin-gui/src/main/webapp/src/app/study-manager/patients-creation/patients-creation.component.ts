import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PatientDialogBase} from "../patient-dialog-base";
import {compareStudies, Study} from "../study";
import {PatientReference} from "../patient-reference";
import {NgForm} from "@angular/forms";
import {StudyManagerService} from "../study-manager.service";
import {NotificationService} from "../../helpers";
import {Participation} from "../participation";
import {SICGeneration} from '../sic-generation';
import {PatientReferenceToRootPipe} from "../patient-reference-to-root.pipe";
import {GridModel} from "./patients-text-area/patients-text-area.component";

declare var $: any;

@Component({
    selector: 'patients-creation',
    templateUrl: './patients-creation.component.html',
    styleUrls: ['./patients-creation.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientReferenceToRootPipe]
})
export class PatientsCreationComponent extends PatientDialogBase implements OnInit {
    public studies: Study[] = [];
    @Output()
    public selectedStudyChange: EventEmitter<Study> = new EventEmitter();
    public extension: string;
    public selectedReference: PatientReference = PatientReference.Patient;
    public references: PatientReference[] = [PatientReference.Patient, PatientReference.Encounter, PatientReference.Billing];
    public generateSic: boolean = false;
    protected readonly SICGeneration = SICGeneration;
    protected readonly compareStudies = compareStudies;

    public entries: GridModel[];

    @ViewChild(NgForm)
    private form: NgForm;
    public participation: Participation;
    public comment: string;

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService,
                private toRootPipe: PatientReferenceToRootPipe) {
        super(studyManagerService);
    }

    private _selectedStudy: Study;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    @Input()
    public set selectedStudy(value: Study) {
        this._selectedStudy = value;

        if (!!value) {
            if (this._selectedStudy.optOut) {
                this.participation = Participation.OptOut;
            } else if (this._selectedStudy.optIn) {
                this.participation = Participation.OptIn;
            }

            this.generateSic = this._selectedStudy.sicGeneration === SICGeneration.AutoAndManual;
        }
        this.selectedStudyChange.emit(this._selectedStudy);
    }

    @ViewChild('accordion', {static: false})
    private set accordion(value: ElementRef<HTMLDivElement>) {
        if (!!value) {
            $(value.nativeElement).accordion({exclusive: false});
        }
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
        this.studyManagerService.getStudies().subscribe(s => this.studies = s);
    }

    public create(): void {
        if (this.form.valid) {
            this.studyManagerService.createEntries(this.selectedStudy.id,
                this.selectedReference,
                this.toRootPipe.transform(this.selectedReference),
                this.entries,
                this.participation,
                this.comment,
                this.generateSic)
                .subscribe({
                    next: e => {
                        this.notificationService.showSuccess("Patient*innen registriert");
                        this.close();
                    },
                    error: e => this.notificationService.showError('Patient*innen konnten nicht registriert werden')
                });
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben');
        }
    }
}
