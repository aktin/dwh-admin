import { Component, OnInit } from "@angular/core";
import { ParseExtrasService } from "../commons/commons.module";
import { Config } from "../commons/parse-extras.service";

declare var SystemJS;

@Component({
  selector: "test-dummy",
  providers: [ParseExtrasService],
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor(private _config: ParseExtrasService) {}

  config: any = "hallo";
  page: string = "";

  showConfig() {
    // this.page = this._config.getPage();
    this._config.getPage().subscribe((data: any) => {
      console.log(123);
      console.log(data);
      this.page = data;
    });
    this._config.getConfig().subscribe((data: any) => {
      console.log(123);
      console.log(data);
      this.config = data;
    });
  }
  ngOnInit() {}
}
