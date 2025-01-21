import {Pipe, PipeTransform} from '@angular/core';
import {PatientReference} from "./patient-reference";
import {StudyManagerService} from "./study-manager.service";

@Pipe({
    name: 'patientReferenceToRoot'
})
export class PatientReferenceToRootPipe implements PipeTransform {
    constructor(private studyManagerService: StudyManagerService) {
    }

    transform(value: PatientReference): string {
        return this.studyManagerService.preferences?.[`root${value}`];
    }
}
