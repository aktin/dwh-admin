import {StudyManagerService} from "../services/study-manager.service";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive({})
export abstract class PatientDialogBase {
    public preferences: Map<string, string>;

    protected constructor(protected studyManagerService: StudyManagerService) {
    }

}
