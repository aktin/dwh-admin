import {
    Component,
    ContentChildren,
    ElementRef,
    HostBinding,
    Optional,
    QueryList,
    ViewEncapsulation
} from '@angular/core';
import {ErrorMessageComponent} from './error-message.component';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: '.field',
    styleUrl: './field.component.css',
    templateUrl: "./field.component.html",
    providers: [{provide: ControlContainer, useExisting: NgForm}],
    encapsulation: ViewEncapsulation.None
})
export class FieldComponent {
    @ContentChildren(ErrorMessageComponent, {descendants: true})
    private errorMessageComponents: QueryList<ElementRef>;

    constructor(@Optional() private frm: NgForm) {
    }

    public get isSubmitted(): boolean {
        return !this.frm || this.frm?.submitted;
    }

    @HostBinding('class.error')
    private get hasError(): boolean {
        return !!this.errorMessageComponents?.length && this.isSubmitted;
    }
}
