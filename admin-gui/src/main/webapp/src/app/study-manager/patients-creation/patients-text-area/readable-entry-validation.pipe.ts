import {Pipe, PipeTransform} from '@angular/core';
import {EntryValidation} from './entry-validation';
import {PatientReference} from '../../patient-reference';
import {PatientReferenceToLabelPipe} from '../../patient-reference-to-label.pipe';

@Pipe({
    name: 'readableEntryValidation'
})
export class ReadableEntryValidationPipe implements PipeTransform {
    constructor(private readonly patientReferenceToLabelPipe: PatientReferenceToLabelPipe) {}

    transform(value: EntryValidation, reference: PatientReference): string {
        let result;
        switch (value) {
            case EntryValidation.Valid:
                result = 'OK';
                break;
            case EntryValidation.EntryFound:
                result = 'Patient*in existiert bereits';
                break;
            case EntryValidation.SicFound:
                result = 'Studien-ID existiert bereits';
                break;
            case EntryValidation.SicMissing:
                result = 'Studien-ID erforderlich';
                break;
            case EntryValidation.NoMasterdataFound:
                result = 'Keine Stammdaten gefunden';
                break;
            case EntryValidation.NoEncountersFound:
                result = 'Keine Behandlungsfalldaten gefunden';
                break;
            case EntryValidation.PatientReferenceDuplicate:
                result = `${this.patientReferenceToLabelPipe.transform(reference)} mehrfach angegeben`;
                break;
            case EntryValidation.SicDuplicate:
                result = 'Studien-ID mehrfach angegeben';
                break;
            case EntryValidation.Pending:
                result = '';
                break;
        }
        return result;
    }

}
