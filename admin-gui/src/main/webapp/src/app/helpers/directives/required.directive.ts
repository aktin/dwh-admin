import {AfterViewInit, Directive, ElementRef} from '@angular/core';

/**
 * Directive to append an asterisk * to the label of a required html form element
 */
@Directive({
    selector: '.field'
})
export class RequiredDirective implements AfterViewInit {
    constructor(private el: ElementRef<HTMLElement>) {
    }

    ngAfterViewInit(): void {
        const label = Array.from(this.el.nativeElement.children).find(e => e.tagName.toLowerCase() === 'label');

        //check if element has direct label descendant and has a child with required attribute
        if (!!label && !!this.el.nativeElement.querySelector('[required]')) {
            label.textContent += ' *';
        }
    }
}
