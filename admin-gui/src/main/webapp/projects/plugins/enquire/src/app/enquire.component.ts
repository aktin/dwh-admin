import { Component } from "@angular/core";
import { UrlService } from "@aktin/utils";

@Component({
  selector: "enquire-component",
  templateUrl: "./enquire.component.html",
  styleUrls: ["./enquire.component.css"]
})
export class EnquireComponent {
  state = { link: "" };
  constructor(private _url: UrlService) {
    console.log(this._url.link(["HOME"]));
    this.state.link = this.getUrls("REPORT", "SINGLE");
  }
  getUrls(...routes) {
    if (!this._url) return routes.join("/");
    return "#" + this._url.link(routes);
  }
}
