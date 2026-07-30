import {Pipe, PipeTransform} from '@angular/core';
import {compareEntryValidationBySeverity, EntryValidation} from '../../models/entry-validation';
import {PatientReference} from '../../models/patient-reference';
import {PatientReferenceToLabelPipe} from '../../helpers/patient-reference-to-label.pipe';

type MessageFn = (reference: PatientReference) => string;

@Pipe({
    name: 'readableEntryValidation'
})
export class ReadableEntryValidationPipe implements PipeTransform {

    private readonly validationMessageMap: Record<EntryValidation, MessageFn> = {
        [EntryValidation.Valid]: () => 'OK',
        [EntryValidation.EntryFound]: () => 'Patient*in bereits registriert',
        [EntryValidation.SicFound]: () => 'Studien-ID existiert bereits',
        [EntryValidation.SicMissing]: () => 'Studien-ID erforderlich',
        [EntryValidation.NoMasterdataFound]: () => 'Keine Stammdaten gefunden',
        [EntryValidation.NoEncountersFound]: () => 'Keine Behandlungsfalldaten gefunden',
        [EntryValidation.PatientReferenceMissing]: (reference) =>
            `${this.patientReferenceToLabelPipe.transform(reference)} fehlt`,
        [EntryValidation.PatientReferenceDuplicate]: (reference) =>
            `${this.patientReferenceToLabelPipe.transform(reference)} mehrfach angegeben`,
        [EntryValidation.SicDuplicate]: () => 'Studien-ID mehrfach angegeben',
        [EntryValidation.Pending]: () => '',

        [EntryValidation.ExtensionSlashSeparator]: (reference) =>
            `Maximal ein "/" als Trennzeichen von Root und ${this.patientReferenceToLabelPipe.transform(reference)} erlaubt`,
        [EntryValidation.ExtensionSlashNotAllowed]: () => '"/" nicht erlaubt',
        [EntryValidation.ExtensionSeparatorPosition]: () => 'Trennzeichen darf nicht an erster Stelle stehen',
        [EntryValidation.ExtensionPeriod]: (reference) =>
            `Root und ${this.patientReferenceToLabelPipe.transform(reference)} dürfen nicht aus "." oder ".." bestehen`,
        [EntryValidation.ExtensionLineBreak]: () => 'Zeilenumbrüche sind nicht erlaubt',
        [EntryValidation.ExtensionWhitespace]: () => 'Leerzeichen sind nicht erlaubt',
    };

    constructor(private readonly patientReferenceToLabelPipe: PatientReferenceToLabelPipe) {}

    transform(value: EntryValidation[], reference: PatientReference): string {
        const convertedValues = value
            .sort(compareEntryValidationBySeverity)
            .map(v => this.validationMessageMap[v](reference));
        return !!convertedValues?.length ? convertedValues.join('; ') : 'OK';
    }

}
