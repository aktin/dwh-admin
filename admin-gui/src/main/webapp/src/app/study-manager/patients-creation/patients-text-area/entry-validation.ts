export enum EntryValidation {
    Valid = 'VALID',
    EntryFound = 'ENTRY_FOUND',
    SicFound = 'SIC_FOUND',
    SicMissing = 'SIC_MISSING',
    NoMasterdataFound = 'MASTER_DATA_NOT_FOUND',
    NoEncountersFound = 'ENCOUNTERS_NOT_FOUND',
    PatientReferenceDuplicate = 'DUPLICATE_PAT_REF',
    SicDuplicate = 'DUPLICATE_SIC',
    Pending = 'PENDING',
}
