import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UrlService } from "../../core";

@Component({
  selector: "test-dummy",
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _url: UrlService) {}

  config: any = "hallo";

  showConfig() {}
  ngOnInit() {
    console.log(this._route);
  }

  getUrls(...routes) {
    return this._url.link(routes);
  }
}
