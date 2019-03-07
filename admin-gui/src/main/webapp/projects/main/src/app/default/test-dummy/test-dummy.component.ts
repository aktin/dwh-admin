import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UrlService } from "@aktin/utils";

@Component({
  selector: "test-dummy",
  templateUrl: "./test-dummy.component.html",
  styles: [""]
})
export class TestDummyComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _url: UrlService) {}

  ngOnInit() {
    console.log(this._route);
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
