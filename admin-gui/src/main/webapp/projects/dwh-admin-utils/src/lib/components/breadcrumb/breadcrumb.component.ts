import { Component, Input } from "@angular/core";

@Component({
  selector: "breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styles: []
})
export class BreadcrumbComponent {
  @Input() path: [string, string][] = [];

  constructor() {}

  isFirst(i: number) {
    return i === 0;
  }

  isCurrent(i: number) {
    return i === this.path.length - 1;
  }
}
