import {Directive, Input} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {debounceTime, distinctUntilChanged, first, Observable, switchMap} from 'rxjs';
import {StudyManagerService} from '../study-manager.service';
import {map} from 'rxjs/operators';

@Directive({
    selector: 'input[uniqueSic]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: UniqueSicValidatorDirective,
            multi: true,
        },
    ]
})
export class UniqueSicValidatorDirective implements AsyncValidator {
    @Input()
    public studyId: string;

    constructor(private consentManagerService: StudyManagerService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return control.valueChanges.pipe(debounceTime(400),
            distinctUntilChanged(),
            switchMap(v => this.consentManagerService.getEntryBySic(this.studyId, v)),
            map(e => !!e ? {'sicNotUnique': true} : null),
            first());
    }
}
