package org.aktin.dwh.admin.optin;

/**
 * Validation result of a inserted entry data
 */
public enum EntryValidation {
    Valid,
    EntryFound, // Patient entry already exists
    SicFound, // SIC already exists
    PatientReferenceMissing, // No patient reference given
    SicMissing, // No SIC given, when it is required
    NoMasterdataFound, // No master data in db found
    NoEncountersFound, // No encounters in db found
    PatientReferenceDuplicate, // User entered a patient reference at least twice
    SicDuplicate, // User entered a SIC at least twice
    Pending, // Validation has not occurred yet
}