import {Component, ContentChildren, ElementRef, HostBinding, QueryList, ViewEncapsulation} from '@angular/core';
import {ErrorMessageComponent} from './error-message.component';

@Component({
    selector: '.field',
    styleUrl: './field.component.css',
    templateUrl: "./field.component.html",
    encapsulation: ViewEncapsulation.None
})
export class FieldComponent {
    @ContentChildren(ErrorMessageComponent, {descendants: true})
    private errorMessageComponents: QueryList<ElementRef>;

    @HostBinding('class.error')
    protected get hasError(): boolean {
        return !!this.errorMessageComponents?.length;
    }
}
