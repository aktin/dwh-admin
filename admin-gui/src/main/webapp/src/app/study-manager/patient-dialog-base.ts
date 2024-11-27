import {Encounter} from "./encounter";
import {MasterData} from "./master-data";
import {DateFormat, MomentDatePipe, TableColumns} from "../helpers";
import moment from "moment";
import {StudyManagerService} from "./study-manager.service";
import {PatientReference} from "./patient-reference";

export abstract class PatientDialogBase {
    public preferences: string;

    protected isOpen: boolean = false;

    protected constructor(protected studyManagerService: StudyManagerService) {
    }

    public getLabel(ref: PatientReference): string {
        return this.preferences?.[`label${ref}`];
    }

    public getRoot(ref: PatientReference): string {
        return this.preferences?.[`root${ref}`];
    }

    public open(): void {
        this.isOpen = true;
    }

    public close(): void {
        this.isOpen = false;
    }
}
