import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Entry} from "../entry";
import {PatientDialogBase} from "../patient-dialog-base";
import {DateFormat} from "../../helpers";
import {StudyManagerService} from "../study-manager.service";
import {Participation} from "../participation";
import {Encounter} from "../encounter";
import {MasterData} from "../master-data";
import {PatientReferenceToRootPipe} from "../patient-reference-to-root.pipe";

declare var $: any;

@Component({
    selector: 'patient-view',
    templateUrl: './patient-view.component.html',
    styleUrls: ['./patient-view.component.css', '../../helpers/popup-message.component.css'],
    providers: [PatientReferenceToRootPipe]
})
export class PatientViewComponent extends PatientDialogBase implements OnInit {
    public isPatientEditComponentOpen: boolean = false;
    protected encounters: Encounter[];
    protected masterData: MasterData;
    protected readonly DateFormat = DateFormat;
    protected readonly Participation = Participation;

    constructor(studyManagerService: StudyManagerService,
                private toRootPipe: PatientReferenceToRootPipe) {
        super(studyManagerService);
    }

    private _entry: Entry;

    public get entry(): Entry {
        return this._entry;
    }

    @Input()
    public set entry(value: Entry) {
        this._entry = value;

        if (!!value) {
            this.studyManagerService.getEncounters(this.entry.reference, this.toRootPipe.transform(this.entry.reference), this.entry.idExt)
                .subscribe(e => this.encounters = e);
            this.studyManagerService.getMasterData(this.entry.reference, this.toRootPipe.transform(this.entry.reference), this.entry.idExt)
                .subscribe(m => this.masterData = m);
        }
    }

    @ViewChild('accordion', {static: false})
    private set accordion(value: ElementRef<HTMLDivElement>) {
        if (!!value) {
            $(value.nativeElement).accordion({exclusive: false});
        }
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
    }
}
