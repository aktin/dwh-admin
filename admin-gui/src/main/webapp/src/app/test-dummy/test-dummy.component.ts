import { Component, OnInit } from "@angular/core";

@Component({
  selector: "test-dummy",
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor() {}

  config: any = "hallo";

  showConfig() {}
  ngOnInit() {}
}
