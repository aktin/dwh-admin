import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {compareStudies, Study} from '../study';
import {Entry} from '../entry';
import {PatientReference} from '../patient-reference';
import {forkJoin} from 'rxjs';
import {Participation} from '../participation';
import {NgForm} from '@angular/forms';
import {SICGeneration} from "../sic-generation";
import {PatientDialogBase} from "../patient-dialog-base";
import {StudyManagerService} from "../study-manager.service";
import {Encounter} from "../encounter";
import {MasterData} from "../master-data";
import {NotificationService} from "../../helpers";

declare var $: any;

@Component({
    selector: 'patient-creation',
    templateUrl: './patient-creation.component.html',
    styleUrls: ['./patient-creation.component.css', '../../helpers/popup-message.component.css'],
})
export class PatientCreationComponent extends PatientDialogBase implements OnInit {
    public studies: Study[] = [];
    @Output()
    public selectedStudyChange: EventEmitter<Study> = new EventEmitter();
    public newEntry: Entry = new Entry();
    public extension: string;
    public selectedReference: PatientReference = PatientReference.Patient;
    public references: PatientReference[] = [PatientReference.Patient, PatientReference.Encounter, PatientReference.Billing];
    public generateSic: boolean = false;
    protected readonly SICGeneration = SICGeneration;
    protected readonly compareStudies = compareStudies;
    @ViewChild(NgForm)
    private form: NgForm;
    protected encounters: Encounter[];
    protected masterData: MasterData;

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService) {
        super(studyManagerService);
    }

    private _selectedStudy: Study;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    @Input()
    public set selectedStudy(value: Study) {
        this._selectedStudy = value;

        if(!!value) {
            if (this._selectedStudy.optOut) {
                this.newEntry.participation = Participation.OptOut;
            } else if (this._selectedStudy.optIn) {
                this.newEntry.participation = Participation.OptIn;
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

    public loadEncountersAndMasterData(): void {
        forkJoin([this.studyManagerService.getEncounters(this.selectedReference, this.getRoot(this.selectedReference), this.extension),
            this.studyManagerService.getMasterData(this.selectedReference, this.getRoot(this.selectedReference), this.extension)])
            .subscribe(([e, m]) => {
                this.encounters = e;
                this.masterData = m;
            });
    }

    public create(): void {
        if (this.form.valid) {
            this.studyManagerService.createEntry(this.selectedStudy.id, this.selectedReference, this.getRoot(this.selectedReference), this.extension, this.newEntry)
                .subscribe({next: e => {
                        this.notificationService.showSuccess("Patient*in registriert");
                        this.close();
                    },
                error: e => this.notificationService.showError('Patient*in konnte nicht registriert werden')});
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben')
        }
    }
}

