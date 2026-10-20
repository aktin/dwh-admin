import {Directive, ElementRef, OnInit} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[drop-down]',
  host: {
    class: 'ui dropdown'
  },
  standalone: true,
})
export class DropDownDirective implements OnInit {
  constructor(private host: ElementRef) {
  }

  ngOnInit(): void {
    $(this.host.nativeElement).dropdown();
  }
}
