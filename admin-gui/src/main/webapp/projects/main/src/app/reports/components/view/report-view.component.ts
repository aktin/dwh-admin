import { Component, Input } from "@angular/core";
import { Report } from "../../models";

@Component({
  selector: "report-view",
  templateUrl: "./report-view.component.html",
  styles: [],
})
export class ReportViewComponent {
  @Input() data: Report;
  constructor() {}

  get report(): Report {
    return this.data;
  }

  ngOnInit() {}
}
