package org.aktin.dwh.admin.optin.model;

// errors that occur during CRUD operations on opt-in data
public enum OptInErrorType {
    STUDIES_NOT_FOUND,
    STUDY_NOT_FOUND,
    PATIENTS_NOT_FOUND,
    PATIENT_NOT_FOUND,
    PATIENT_ALREADY_EXISTS,
    SIC_ALREADY_EXISTS,
    ENCOUNTERS_NOT_FOUND,
    MASTERDATA_NOT_FOUND,
    UNKNOWN;
}
