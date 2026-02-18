import {Directive, ElementRef, OnInit} from '@angular/core';

declare var $: any;

@Directive({
    selector: '.ui.accordion',
})
export class AccordionDirective implements OnInit {
    constructor(private host: ElementRef) {

    }

    ngOnInit(): void {
        $(this.host.nativeElement).accordion({exclusive: false});
    }
}
