import {Directive, Host, HostBinding} from '@angular/core';
import {NgForm} from '@angular/forms';


/**
 * Angular handles form validation, but Fomantic UI styles highlight unsubmitted invalid form fields in red
 * This directive adds .initial on unsubmitted forms, to prevent unsolicited highlighting
 */
@Directive({
    selector: '[ngForm]'
})
export class InitialFormDirective {
    @HostBinding('class.initial')
    public get isSubmitted(): boolean {
        return !this.form.submitted;
    };

    constructor(@Host() private form: NgForm) {
    }

}
