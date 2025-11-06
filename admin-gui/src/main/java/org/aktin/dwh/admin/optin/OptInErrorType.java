package org.aktin.dwh.admin.optin;

// errors that occur during CRUD operations on opt-in data
public enum OptInErrorType implements ErrorType {
    STUDY_NOT_FOUND,
    PATIENT_NOT_FOUND,
    PATIENT_ALREADY_EXISTS,
    SIC_ALREADY_EXISTS,
}
