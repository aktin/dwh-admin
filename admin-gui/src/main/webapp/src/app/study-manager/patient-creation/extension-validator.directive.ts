import {Directive, OnInit} from '@angular/core';
import {AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, of, take} from "rxjs";
import {PatientValidationService} from "../services/patient-validation.service";
import {map} from "rxjs/operators";
import {EntryValidation} from "../models/entry-validation";
import {ExternalTriggeredAsyncValidatorBase} from "../helpers/external-triggered-async-validator-base";
import {validateExtension} from "../helpers/extension-validation";

@Directive({
    selector: 'input[extension]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: ExtensionValidatorDirective,
            multi: true,
        },
    ]
})
export class ExtensionValidatorDirective extends ExternalTriggeredAsyncValidatorBase implements OnInit {
    constructor(private patientValidationService: PatientValidationService) {
        super();
    }

    ngOnInit() {
        this.reactToExternalChanges(this.patientValidationService.revalidate$);
    }

    /**
     * Validates the given control's value based on specific formatting rules and preferences.
     *
     * @param {AbstractControl} control - The form control to validate. It contains the value to be checked.
     * @return {Promise<ValidationErrors> | Observable<ValidationErrors> | null} An observable containing validation errors if any conditions are violated, or null if the value is valid.
     */
    validate(control: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> {
        const value = control.value;

        if (!value) {
            return null;
        }

        // run the shared, extensible format rules (slash, separator, period, line breaks, ...)
        const violations = validateExtension(value);
        if (violations.length) {
            return of(violations.reduce((errors, key) => ({...errors, [key]: true}), {} as ValidationErrors));
        }

        return this.patientValidationService.validationData$.pipe(
            map(v => v?.find(e => e.extension === value)?.validationResults ?? []),
            map(v => v?.find(e => e === EntryValidation.EntryFound) ? {'extensionFound': true} : null),
            take(1));
    }
}
