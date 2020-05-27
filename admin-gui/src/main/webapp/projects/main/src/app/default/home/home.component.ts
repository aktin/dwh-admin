import { Component, OnInit } from "@angular/core";
import {UrlService} from "@aktin/utils";

@Component({
  selector: "admin-gui-home",
  templateUrl: "./home.component.html",
  styles: [""]
})
export class HomeComponent implements OnInit {
  constructor(private _url: UrlService) {
    console.log("url test ", this._url.parse("url"));
  }

  ngOnInit() {}
}
