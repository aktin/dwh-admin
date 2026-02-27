package org.aktin.dwh.admin.optin.error;

// errors that occur during CRUD operations on opt-in data
public enum OptInErrorType {
    PARAM_INVALID,
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
