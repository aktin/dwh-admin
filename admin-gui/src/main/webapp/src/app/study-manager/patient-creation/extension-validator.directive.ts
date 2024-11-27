import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
    selector: 'input[extension]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: ExtensionValidatorDirective,
            multi: true,
        },
    ]
})
export class ExtensionValidatorDirective implements Validator {
    private prefs: {
        separator: string,
        root: string
    } = {separator: '/', root: ''}

    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }

        // maximal one slash as separator if root is not set in properties
        if (this.prefs['separator'] === '/' && this.prefs['root'] === '' && value.match(/\//g)?.length > 1) {
            return {slashSep: true};
        }
        // no slash allowed if root is set in properties (reserved for path syntax)
        if ((this.prefs['separator'] !== '/' || this.prefs['root'] !== '') && value.includes('/')) {
            return {slash: true};
        }
        // separator not as first character if root is not set in properties
        if (this.prefs['root'] === '' && value.slice(0, 1) === this.prefs['separator']) {
            return {separator: true};
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
            return {period: true};
        }

        return null;
    }
}
