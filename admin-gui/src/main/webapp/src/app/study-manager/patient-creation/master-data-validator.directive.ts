import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';
import {debounceTime, distinctUntilChanged, first, forkJoin, Observable, switchMap, tap} from 'rxjs';
import {StudyManagerService} from '../study-manager.service';
import {PatientReference} from '../patient-reference';
import {filter, map} from 'rxjs/operators';
import {MasterData} from '../master-data';
import {Encounter} from '../encounter';

@Directive({
    selector: 'input[masterData]',
    providers: [{
        provide: NG_ASYNC_VALIDATORS,
        useExisting: MasterDataValidatorDirective,
        multi: true
    }]
})
export class MasterDataValidatorDirective implements AsyncValidator {
    @Input()
    public reference: PatientReference;
    @Input()
    public root: string;

    @Output()
    public masterData: EventEmitter<MasterData> = new EventEmitter<MasterData>();

    constructor(private consentManagerService: StudyManagerService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return control.valueChanges.pipe(filter(_ => !!this.reference && !!this.root),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(v => this.consentManagerService.getMasterData(this.reference, this.root, v)),
            tap((m) => this.masterData.emit(m)),
            map((m) => {
                if (!!m) {
                    return null;
                }

                return {
                    'noMasterData': !m,
                };
            }),
            first());
    }

}
