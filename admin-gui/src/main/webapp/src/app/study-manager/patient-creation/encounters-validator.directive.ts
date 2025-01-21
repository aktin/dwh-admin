import {Directive, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {debounceTime, distinctUntilChanged, first, Observable, switchMap, tap} from 'rxjs';
import {PatientReference} from '../patient-reference';
import {Encounter} from '../encounter';
import {StudyManagerService} from '../study-manager.service';
import {filter, map} from 'rxjs/operators';

@Directive({
    selector: 'input[encounters]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: EncountersValidatorDirective, multi: true}]
})
export class EncountersValidatorDirective implements AsyncValidator {
    @Input()
    public reference: PatientReference;
    @Input()
    public root: string;

    @Output()
    public encounters: EventEmitter<Encounter[]> = new EventEmitter<Encounter[]>();

    constructor(private consentManagerService: StudyManagerService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return control.valueChanges.pipe(filter(_ => !!this.reference && !!this.root),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(v => this.consentManagerService.getEncounters(this.reference, this.root, v)),
            tap((e) => this.encounters.emit(e)),
            map(e => {
                if (!!e?.length) {
                    return null;
                }

                return {
                    'noEncounters': !e?.length
                };
            }),
            first());
    }
}
