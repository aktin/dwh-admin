import {Pipe, PipeTransform} from '@angular/core';
import {PatientReference} from "./patient-reference";
import {StudyManagerService} from "./study-manager.service";

@Pipe({
    name: 'patientReferenceToLabel'
})
export class PatientReferenceToLabelPipe implements PipeTransform {
    constructor(private studyManagerService: StudyManagerService) {
    }

    transform(value: PatientReference): string {
        return this.studyManagerService.preferences?.[`label${value}`];
    }
}
