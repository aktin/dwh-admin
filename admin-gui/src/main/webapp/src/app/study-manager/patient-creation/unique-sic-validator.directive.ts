import {Directive} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, of, take} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {PatientValidationService} from '../services/patient-validation.service';
import {EntryValidation} from '../models/entry-validation';


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
    constructor(private patientValidationService: PatientValidationService) {
    }

    /**
     * Validates the given control's value against patient validation data.
     *
     * @param {AbstractControl<string>} control The form control to validate. Its value is expected to be a SIC identifier.
     * @return {Promise<ValidationErrors | null> | Observable<ValidationErrors | null>} An observable or promise that resolves to a validation error object if the SIC is not unique, or null if valid.
     */
    validate(control: AbstractControl<string>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const sic = control.value;

        if (!sic) {
            return of(null);
        }

        return this.patientValidationService.validationData$.pipe(map(v => v?.find(e => e.sic === sic)?.validationResults),
            filter(v => !!v?.length),
            map(v => v?.find(e => e === EntryValidation.SicFound)),
            map(e => !!e ? {'sicNotUnique': true} : null),
            take(1));
    }
}
