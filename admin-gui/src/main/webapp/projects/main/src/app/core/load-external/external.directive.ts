import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[external]'
})
export class ExternalDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
