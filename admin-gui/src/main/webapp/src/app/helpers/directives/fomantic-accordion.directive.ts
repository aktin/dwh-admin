import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';

declare const $: any;

@Directive({
    selector: '.ui.accordion'
})
export class FomanticAccordionDirective implements OnInit, OnDestroy {

    constructor(private el: ElementRef<HTMLElement>) {
    }

    ngOnInit(): void {
        $(this.el.nativeElement).accordion();
    }

    ngOnDestroy(): void {
        $(this.el.nativeElement).accordion('destroy');
    }
}
