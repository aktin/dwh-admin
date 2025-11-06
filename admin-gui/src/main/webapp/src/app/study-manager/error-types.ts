import {ServerError} from '../helpers/error/error';

export interface StudyManagerError extends ServerError {
    type: StudyManagerErrorType | string;
}

export enum StudyManagerErrorType {
    STUDY_NOT_FOUND = "STUDY_NOT_FOUND",
    PATIENT_NOT_FOUND = "PATIENT_NOT_FOUND",
    PATIENT_ALREADY_EXISTS = "PATIENT_ALREADY_EXISTS",
    SIC_ALREADY_EXISTS = "SIC_ALREADY_EXISTS",
}
