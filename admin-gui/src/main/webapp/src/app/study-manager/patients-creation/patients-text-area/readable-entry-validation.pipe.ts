import {Pipe, PipeTransform} from '@angular/core';
import {EntryValidation} from './entry-validation';

@Pipe({
    name: 'readableEntryValidation'
})
export class ReadableEntryValidationPipe implements PipeTransform {

    transform(value: EntryValidation): string {
        let result;
        switch (value) {
            case EntryValidation.Valid:
                result = '';
                break;
            case EntryValidation.EntryFound:
                result = 'Patient existiert bereits';
                break;
            case EntryValidation.SicFound:
                result = 'SIC existiert bereits';
                break;
            case EntryValidation.PatientReferenceMissing:
                result = 'Patientenreferenz erforderlich';
                break;
            case EntryValidation.SicMissing:
                result = 'SIC erforderlich';
                break;
            case EntryValidation.NoMasterdataFound:
                result = 'Keine Stammdaten gefunden';
                break;
            case EntryValidation.NoEncountersFound:
                result = 'Keine Aufenthalte gefunden';
                break;
            case EntryValidation.PatientReferenceDuplicate:
                result = 'Patientenreferenz mehrfach angegeben';
                break;
            case EntryValidation.SicDuplicate:
                result = 'SIC mehrfach angegeben';
                break;
            case EntryValidation.Pending:
                result = '';
                break;
        }
        return result;
    }

}
