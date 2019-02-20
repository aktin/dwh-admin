import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LinkerService } from "@app/core/services/linker.service";

@Component({
  selector: "test-dummy",
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _linker: LinkerService) {}

  config: any = "hallo";

  showConfig() {}
  ngOnInit() {
    console.log(this._route);
  }

  getUrls(...routes) {
    return this._linker.parse(routes);
  }
}
