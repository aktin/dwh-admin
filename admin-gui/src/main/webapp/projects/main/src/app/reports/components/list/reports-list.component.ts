import { Component, OnInit } from "@angular/core";
import { UrlService } from "@aktin/utils";

@Component({
  selector: "admin-gui-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["../../reports.css"]
})
export class ReportsListComponent implements OnInit {
  constructor(private _url: UrlService) {}

  ngOnInit() {}

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
