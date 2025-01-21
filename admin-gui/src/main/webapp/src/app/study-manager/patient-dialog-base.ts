import {StudyManagerService} from "./study-manager.service";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive({})
export abstract class PatientDialogBase {
    public preferences: Map<string, string>;

    @Output()
    public onClose: EventEmitter<void> = new EventEmitter<void>();

    protected constructor(protected studyManagerService: StudyManagerService) {
    }

    public close(): void {
        this.onClose.emit();
    }
}
