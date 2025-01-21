import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Participation} from '../participation';
import {DateFormat, NotificationService} from '../../helpers';
import {PatientDialogBase} from '../patient-dialog-base';
import {Entry} from '../entry';
import {NgForm} from '@angular/forms';
import {Encounter} from '../encounter';
import {MasterData} from '../master-data';
import {StudyManagerService} from '../study-manager.service';

declare var $: any;

@Component({
    selector: 'patient-edit',
    templateUrl: './patient-edit.component.html',
    styleUrls: ['./patient-edit.component.css', '../../helpers/popup-message.component.css']
})
export class PatientEditComponent extends PatientDialogBase implements OnInit {
    @Input()
    public entry: Entry;
    @ViewChild(NgForm)
    private form: NgForm;
    protected encounters: Encounter[];
    protected masterData: MasterData;

    protected readonly Participation = Participation;
    protected readonly DateFormat = DateFormat;


    @ViewChild('accordion', {static: false})
    private set accordion(value: ElementRef<HTMLDivElement>) {
        if (!!value) {
            $(value.nativeElement).accordion({exclusive: false});
        }
    }

    constructor(studyManagerService: StudyManagerService,
                private notificationService: NotificationService,) {
        super(studyManagerService);
    }

    ngOnInit(): void {
        this.studyManagerService.getPreferences().subscribe(p => this.preferences = p);
        this.studyManagerService.getEncounters(this.entry.reference, this.entry.idRoot, this.entry.idExt)
            .subscribe(e => this.encounters = e);
        this.studyManagerService.getMasterData(this.entry.reference, this.entry.idRoot, this.entry.idExt)
            .subscribe(m => this.masterData = m);
    }

    public save(): void {
        if (this.form.valid) {
            this.studyManagerService.updateEntry(this.entry.study.id, this.entry.reference, this.entry.idRoot, this.entry.idExt, this.entry)
                .subscribe({
                    next: e => {
                        this.notificationService.showSuccess("Änderungen gespeichert");
                        this.close();
                    },
                    error: e => this.notificationService.showError('Änderungen konnten nicht gespeichert werden')
                });
        } else {
            this.notificationService.showError('Alle Felder müssen gültige Werte haben');
        }
    }
}
