import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APP_ROUTE_ALT_LINK, APP_ROUTE_LINK } from "@app/app.routes.names";

@Component({
  selector: "test-dummy",
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor(private _route: ActivatedRoute) {}

  config: any = "hallo";

  showConfig() {}
  ngOnInit() {
    console.log(this._route);
    console.log(APP_ROUTE_ALT_LINK("REPORT"));
  }

  getUrls(...routes) {
    console.log(routes);
    return APP_ROUTE_LINK(routes);
  }
}
