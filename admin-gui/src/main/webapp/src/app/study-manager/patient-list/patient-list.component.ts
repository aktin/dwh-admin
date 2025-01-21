import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {compareStudies, Study} from "../study";
import {Entry} from "../entry";
import {MomentDatePipe, MY_CALENDAR_OPTIONS, TableColumns} from "../../helpers";
import {StudyManagerService} from "../study-manager.service";
import {AngularMyDatePickerDirective, IMyDateModel, IMyOptions} from "gramli-angular-mydatepicker";
import moment from "moment";

@Component({
    selector: 'patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.css',
    providers: [StudyManagerService]
})
export class PatientListComponent implements OnInit {
    public studies: Study[] = [];
    public entries: Entry[] = [];
    public filteredEntries: Entry[] = [];
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

    @ViewChild(AngularMyDatePickerDirective)
    private datePicker: AngularMyDatePickerDirective;
    protected date: IMyDateModel;
    protected search: string = "";

    constructor(private studyManagerService: StudyManagerService,
                @Inject(MY_CALENDAR_OPTIONS) protected options: IMyOptions) {
        this.options.dateRange = true;
    }
    private _selectedStudy: Study = null;
    public isPatientViewComponentOpen: boolean = false;
    public isPatientsCreationComponentOpen: boolean;
    public isPatientCreationComponentOpen: boolean;

    public get selectedStudy(): Study {
        return this._selectedStudy;
    }

    public set selectedStudy(value: Study) {
        this._selectedStudy = value;
        if (!!value) {
            this.loadEntries();
        }
    }

    ngOnInit(): void {
        this.studyManagerService.getStudies()
            .subscribe(studies => {
                this.studies = studies;
                this.selectedStudy = this.studies[0];
            });
    }

    public filter(): void {
        this.filteredEntries = this.entries;
        if(!!this.date) {
            let filterFunc: (e: Entry) => boolean;
            if(this.date.isRange) {
                // '[]' to include begin date and end date
                // https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/
                filterFunc = e => moment.unix(e.timestamp).isBetween(this.date.dateRange.beginJsDate, this.date.dateRange.endJsDate, 'day', '[]');
            } else {
                filterFunc = e => moment.unix(e.timestamp).isSame(this.date.singleDate.jsDate, 'day');
            }
            this.filteredEntries = this.filteredEntries.filter(filterFunc);
        }
    }

    public resetFilter(): void {
        this.datePicker.clearDate();
        this.search = '';
        this.filter();
    }

    public loadEntries(): void {
        this.studyManagerService.getEntries(this.selectedStudy.id).subscribe(e => {
            this.entries = e;
            this.resetFilter();
        });
    }
}
