export enum EntryValidation {
    Valid = 'Valid',
    EntryFound = 'EntryFound',
    SicFound = 'SicFound',
    PatientReferenceMissing='PatientReferenceMissing',
    SicMissing = 'SicMissing',
    NoMasterdataFound = 'NoMasterdataFound',
    NoEncountersFound = 'NoEncountersFound',
    PatientReferenceDuplicate = 'PatientReferenceDuplicate',
    SicDuplicate = 'SicDuplicate',
    Pending = 'Pending',
}
