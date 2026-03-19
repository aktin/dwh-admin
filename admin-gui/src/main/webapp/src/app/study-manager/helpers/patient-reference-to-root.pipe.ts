import {Pipe, PipeTransform} from '@angular/core';
import {PatientReference} from "../models/patient-reference";
import {StudyManagerService} from "../services/study-manager.service";

@Pipe({
    name: 'patientReferenceToRoot'
})
export class PatientReferenceToRootPipe implements PipeTransform {
    constructor(private studyManagerService: StudyManagerService) {
    }

    /**
     * Returns the root for the given patient reference.
     * @param value Patient reference to get the root for.
     */
    transform(value: PatientReference): string {
        return this.studyManagerService.preferences?.[`root${value}`];
    }
}
