package org.aktin.dwh.admin.optin;

/**
 * Validation result of a inserted entry data
 */
//BatchEntryValidation
public enum EntryValidation {
    // Entry Request
    DUPLICATE_PAT_REF, // User entered a patient reference at least twice
    DUPLICATE_SIC, // User entered a SIC at least twice
    SIC_MISSING, // No SIC given, when it is required

    // Database Response???
    ENTRY_FOUND, // Patient entry already exists
    SIC_FOUND, // SIC already exists
    MASTER_DATA_NOT_FOUND, // No master data in db found
    ENCOUNTERS_NOT_FOUND, // No encounters in db found

    // Processing States
    VALID,
    PENDING, // Validation has not occurred yet
}
