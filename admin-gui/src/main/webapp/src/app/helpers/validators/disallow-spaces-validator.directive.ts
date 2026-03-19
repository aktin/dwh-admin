import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[disallowWhitespaces]',
  providers: [{provide: NG_VALIDATORS, useExisting: DisallowSpacesValidatorDirective, multi: true}]
})
export class DisallowSpacesValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!!value && typeof value === 'string' && value.match(/^\s*$/)) {
            return {whitespaceOnly: true};
        }
        return null;
    }
}
