import {Pipe, PipeTransform} from '@angular/core';
import {PatientReference} from "../models/patient-reference";
import {StudyManagerService} from "../services/study-manager.service";


@Pipe({
    name: 'patientReferenceToLabel'
})
export class PatientReferenceToLabelPipe implements PipeTransform {
    constructor(private studyManagerService: StudyManagerService) {
    }

    /**
     * Returns the label for the given patient reference.
     * @param value Patient reference to get the label for.
     */
    transform(value: PatientReference): string {
        return this.studyManagerService.preferences?.[`label${value}`];
    }
}
