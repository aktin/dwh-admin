import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';

declare const $: any;

/**
 * Creation and destruction of fomantic ui drop down
 */
@Directive({
    selector: '.ui.dropdown'
})
export class FomanticDropDownDirective implements OnInit, OnDestroy {
    constructor(private el: ElementRef<HTMLElement>) {
    }

    ngOnInit(): void {
        $(this.el.nativeElement).dropdown();
    }

    ngOnDestroy(): void {
        $(this.el.nativeElement).dropdown('destroy');
    }
}
