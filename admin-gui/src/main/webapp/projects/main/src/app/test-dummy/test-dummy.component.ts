import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UrlService } from "@app/core";
import { Url2Service } from "@app/routing/url2.service";

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
    // return this._url.link(routes);
    return Url2Service.link(routes);
  }
}
