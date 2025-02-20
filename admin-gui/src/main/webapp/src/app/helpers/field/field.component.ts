import {
    Component,
    ContentChild,
    ContentChildren,
    Directive,
    ElementRef,
    HostBinding,
    OnChanges,
    QueryList,
    SimpleChanges, ViewEncapsulation
} from '@angular/core';
import {ErrorMessageComponent} from './error-message.component';
import {NgModel} from '@angular/forms';

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
    private get hasError(): boolean {
        return !!this.errorMessageComponents?.length;
    }
}
