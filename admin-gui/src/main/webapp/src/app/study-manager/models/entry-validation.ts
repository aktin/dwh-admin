export enum EntryValidation {
    Valid = 'VALID',
    EntryFound = 'ENTRY_FOUND',
    SicFound = 'SIC_FOUND',
    SicMissing = 'SIC_MISSING',
    NoMasterdataFound = 'MASTER_DATA_NOT_FOUND',
    NoEncountersFound = 'ENCOUNTERS_NOT_FOUND',
    PatientReferenceMissing = "PATIENT_REFERENCE_MISSING",
    PatientReferenceDuplicate = 'DUPLICATE_PAT_REF',
    SicDuplicate = 'DUPLICATE_SIC',
    Pending = 'PENDING',

    // client-side extension format violations (see extension-validation.ts)
    ExtensionSlashSeparator = 'EXTENSION_SLASH_SEPARATOR',
    ExtensionSeparatorPosition = 'EXTENSION_SEPARATOR_POSITION',
    ExtensionPeriod = 'EXTENSION_PERIOD',
    ExtensionLineBreak = 'EXTENSION_LINE_BREAK',
    ExtensionWhitespace = 'EXTENSION_WHITESPACE',
}

/**
 * Bridges a format rule key from extension-validation.ts to the matching {@link EntryValidation}
 * so client-side format errors flow through the grid's status/severity/filter pipeline.
 * Add an entry here when introducing a new extension rule that should surface in the grid.
 */
export const EXTENSION_ERROR_TO_ENTRY_VALIDATION: Record<string, EntryValidation> = {
    slashSep: EntryValidation.ExtensionSlashSeparator,
    separator: EntryValidation.ExtensionSeparatorPosition,
    period: EntryValidation.ExtensionPeriod,
    lineBreak: EntryValidation.ExtensionLineBreak,
    whitespace: EntryValidation.ExtensionWhitespace,
};

export const severities = ['success', 'warn', 'error', 'pending'] as const;
export type Severity = typeof severities[number];

const severityRank: Record<Severity, number> = {
    pending: 0,
    success: 1,
    warn: 2,
    error: 3,
};

export const entryValidationSeverity: Record<EntryValidation, Severity> = {
    [EntryValidation.Pending]: 'pending',

    [EntryValidation.Valid]: 'success',

    [EntryValidation.SicMissing]: 'warn',
    [EntryValidation.NoMasterdataFound]: 'warn',
    [EntryValidation.NoEncountersFound]: 'warn',

    [EntryValidation.PatientReferenceMissing]: 'error',
    [EntryValidation.PatientReferenceDuplicate]: 'error',
    [EntryValidation.SicDuplicate]: 'error',
    [EntryValidation.EntryFound]: 'error',
    [EntryValidation.SicFound]: 'error',

    [EntryValidation.ExtensionSlashSeparator]: 'error',
    [EntryValidation.ExtensionSeparatorPosition]: 'error',
    [EntryValidation.ExtensionPeriod]: 'error',
    [EntryValidation.ExtensionLineBreak]: 'error',
    [EntryValidation.ExtensionWhitespace]: 'error',
};

export function compareEntryValidationBySeverity(a: EntryValidation, b: EntryValidation): number {
    const sa = severityRank[entryValidationSeverity[a]];
    const sb = severityRank[entryValidationSeverity[b]];
    if (sa !== sb) return sb - sa;
    return 0;
}

export function determineSeverity(validation: EntryValidation[]): Severity {
    if(!validation?.length) return 'success';

    const v = validation.sort(compareEntryValidationBySeverity)[0];
    return entryValidationSeverity[v];
}
