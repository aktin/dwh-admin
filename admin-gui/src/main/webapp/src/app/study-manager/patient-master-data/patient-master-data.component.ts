import {Component, Input} from '@angular/core';
import {DateFormat, MomentDatePipe, TableColumns} from "../../helpers";
import {Encounter} from "../encounter";
import {MasterData} from "../master-data";
import moment from "moment/moment";

@Component({
  selector: 'patient-master-data',
  templateUrl: './patient-master-data.component.html',
  styleUrl: './patient-master-data.component.css'
})
export class PatientMasterDataComponent {
    public encounterColumns: TableColumns<Encounter> = [
        {field: e => new MomentDatePipe().transform(e.startDate, DateFormat.DATETIME), header: 'Aufnahmezeitpunkt', useToTrack: true},
        {field: e => new MomentDatePipe().transform(e.endDate, DateFormat.DATETIME), header: 'Entlassungszeitpunkt'},
        {
            field: e => `${moment.unix(e.startDate).diff(moment.unix(this.masterData?.birthDate), 'years')}`,
            header: 'Alter bei Aufnahme'
        }
    ];

    @Input({required: true})
    public encounters: Encounter[];

    @Input({required: true})
    public masterData: MasterData;

    protected readonly DateFormat = DateFormat;
}
