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

type Severity = 'success' | 'warn' | 'error' | 'pending';

const severityRank: Record<Severity, number> = {
    pending: 0,
    success: 1,
    warn: 2,
    error: 3,
};

const entryValidationSeverity: Record<EntryValidation, Severity> = {
    [EntryValidation.Pending]: 'pending',

    [EntryValidation.Valid]: 'success',

    [EntryValidation.SicMissing]: 'warn',
    [EntryValidation.NoMasterdataFound]: 'warn',
    [EntryValidation.NoEncountersFound]: 'warn',

    [EntryValidation.PatientReferenceDuplicate]: 'error',
    [EntryValidation.SicDuplicate]: 'error',
    [EntryValidation.EntryFound]: 'error',
    [EntryValidation.SicFound]: 'error',
};

export function compareEntryValidationBySeverity(a: EntryValidation, b: EntryValidation): number {
    const sa = severityRank[entryValidationSeverity[a]];
    const sb = severityRank[entryValidationSeverity[b]];
    if (sa !== sb) return sb - sa;
    return a.localeCompare(b);
}

export function determineSeverity(validation: EntryValidation[]): Severity {
    if(!validation?.length) return 'success';

    const v = validation.sort(compareEntryValidationBySeverity)[0];
    return entryValidationSeverity[v];
}
