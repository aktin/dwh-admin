import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UrlService } from "@aktin/utils";
import { Report, ReportStatus } from "../../models";
import { ReportService } from "../../report.service";

@Component({
  selector: "report-view",
  templateUrl: "./report-view.component.html",
  styleUrls: ["../../reports.css"],
})
export class ReportViewComponent {
  @Input() data: Report;
  @Input() listView = true;
  constructor(private _route: ActivatedRoute, private _url: UrlService, private s: ReportService) {}

  ngOnInit() {}

  get report(): Report {
    return this.data;
  }

  get success(): boolean {
    return this.data && this.data.state === ReportStatus.Completed;
  }

  get endDate() {
    let next = new Date(this.data.timespan[1].getTime());
    next.setDate(this.data.timespan[1].getDate() - 1);
    return next;
  }

  download() {
    console.log("downloading this now ... ", this.data.id);
  }
}
