import {Directive, ElementRef, OnInit} from '@angular/core';

declare var $: any;

@Directive({
  selector: 'drop-down .ui.dropdown, [drop-down] .ui.dropdown',
})
export class DropDownDirective implements OnInit {
  constructor(private host: ElementRef) {
  }

  ngOnInit(): void {
    $(this.host.nativeElement).dropdown();
  }
}
