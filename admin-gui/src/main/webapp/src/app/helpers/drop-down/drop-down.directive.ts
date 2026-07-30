import {Directive, ElementRef, OnInit} from '@angular/core';

declare var $: any;

@Directive({
  selector: '.ui.dropdown',
})
export class DropDownDirective implements OnInit {
  constructor(private host: ElementRef) {
  }

  ngOnInit(): void {
    $(this.host.nativeElement).dropdown();
  }
}
