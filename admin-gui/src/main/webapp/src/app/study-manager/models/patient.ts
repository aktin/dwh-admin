import {Participation} from './participation';
import {Study} from './study';
import {BaseModel} from '../../helpers';
import {PatientReference} from './patient-reference';
import {EntryValidation} from './entry-validation';
import {EncounterPeriod} from './encounter-period';
import {MasterData} from './master-data';

export class Patient extends BaseModel {
    public comment: string = '';
    public participation: Participation;
    public extension: string;
    public root: string;
    public reference: PatientReference = PatientReference.Patient;
    public sic: string;
    public timestamp: number;
    public user: string;
    public study: Study;
    public ide: string;
    public generateSic: boolean;
    public validationResults: EntryValidation[];

    public encounters: EncounterPeriod[];
    public masterData: MasterData;

    constructor(obj?: any) {
        super(obj);
        Object.assign(this, obj);
    }

    public get lastEncounter(): EncounterPeriod {
        return this.encounters?.sort((a, b) => b.startDate - a.startDate)?.[0];
    }

    public get participationString(): string {
        switch (this.participation) {
            case Participation.OptIn:
                return 'Einschluss';
            case Participation.OptOut:
                return 'Ausschluss';
        }
    }

}


