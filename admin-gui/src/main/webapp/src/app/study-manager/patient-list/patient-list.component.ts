import {Component, OnInit} from '@angular/core';
import {compareStudies, Study} from "../study";
import {Entry} from "../entry";
import {MomentDatePipe, NotificationService, TableColumns} from "../../helpers";
import {StudyManagerService} from "../study-manager.service";

@Component({
    selector: 'patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.css',
    providers: [StudyManagerService]
})
export class PatientListComponent implements OnInit {
    public studies: Study[] = [];
    public entries: Entry[] = [];
    public columns: TableColumns<Entry> = [
        {
            field: e => new MomentDatePipe().transform(e.timestamp, 'DD.MM.YYYY, HH:mm'),
            header: "Datum"
        },
        {
            field: "sic",
            header: "SIC"
        },
        {
            field: e => e.idExt ?? e.idRoot,
            header: "KIS-ID",
            useToTrack: true
        },
        {
            field: "participationString",
            header: "Teilnahme"
        },
        {
            field: "comment",
            header: "Kommentar"
        }];
    public selectedEntry: Entry;
    protected readonly compareStudies = compareStudies;

    constructor(private consentManager: StudyManagerService, public notificationService: NotificationService) {
    }

    private _selectedStudy: Study = null;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    public set selectedStudy(value: Study) {
        this._selectedStudy = value;
        if(!!value) {
            this.consentManager.getEntries(value.id).subscribe(e => this.entries = e);
        }
    }

    ngOnInit(): void {
        this.consentManager.getStudies()
            .subscribe(studies => {
                this.studies = studies;
                this.selectedStudy = this.studies[0];
            });
    }
}
