import {Directive} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    NG_ASYNC_VALIDATORS,
    NG_VALIDATORS,
    ValidationErrors,
    Validator
} from '@angular/forms';
import {Observable, of, take} from "rxjs";
import {StudyManagerService} from "../services/study-manager.service";
import {PatientValidationService} from "../services/patient-validation.service";
import {filter, map} from "rxjs/operators";
import {EntryValidation} from "../models/entry-validation";

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
export class ExtensionValidatorDirective implements AsyncValidator {
    private prefs: {
        separator: string,
        root: string
    } = {separator: '/', root: ''}

    constructor(private validationService: PatientValidationService) {
    }

    /**
     * Validates the given control's value based on specific formatting rules and preferences.
     *
     * @param {AbstractControl} control - The form control to validate. It contains the value to be checked.
     * @return {Promise<ValidationErrors> | Observable<ValidationErrors> | null} An observable containing validation errors if any conditions are violated, or null if the value is valid.
     */
    validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors>  {
        const value = control.value;

        if (!value) {
            return null;
        }

        // maximal one slash as separator if root is not set in properties
        if (this.prefs['separator'] === '/' && this.prefs['root'] === '' && value.match(/\//g)?.length > 1) {
            return of({slashSep: true});
        }
        // no slash allowed if root is set in properties (reserved for path syntax)
        if ((this.prefs['separator'] !== '/' || this.prefs['root'] !== '') && value.includes('/')) {
            return of({slash: true});
        }
        // separator not as first character if root is not set in properties
        if (this.prefs['root'] === '' && value.slice(0, 1) === this.prefs['separator']) {
            return of({separator: true});
        }
        // set correct root and extension by possibly splitting input on separator
        let root = this.prefs['root'];
        let ext = value;
        if (this.prefs['root'].length === 0) {
            if (value.includes(this.prefs['separator'])) {
                let splits = value.split(this.prefs['separator']);
                root = splits[0];
                ext = value.slice(value.indexOf(this.prefs['separator']) + 1);
            } else {
                root = value;
                ext = '';
            }
        }
        // value of root and extension may not be . or .. (reserved for path syntax)
        const periods = ['.', '..'];
        if (periods.includes(ext) || periods.includes(root)) {
            return of({period: true});
        }

        return this.validationService.validationData$.pipe(map(v => v?.find(e => e.extension === value)?.validationResults),
            filter(v => !!v?.length),
            map(v => v?.find(e => e === EntryValidation.EntryFound)),
            map(e => !!e ? {'extensionFound': true} : null),
            take(1));
    }
}
