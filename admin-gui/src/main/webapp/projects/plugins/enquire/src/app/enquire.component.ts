import { Component } from "@angular/core";
import { UrlService } from "./core";

@Component({
  selector: "enquire-component",
  templateUrl: "./enquire.component.html",
  styleUrls: ["./enquire.component.css"]
})
export class EnquireComponent {
  constructor(private _url: UrlService) {
    console.log(this._url.link(["HOME"]));
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
