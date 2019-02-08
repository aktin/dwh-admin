import { Component, OnInit } from "@angular/core";
import { ParseExtrasService } from "../commons/parse-extras.service";
import { LoadPluginsService, PluginConfig } from "@app/core";
import _ from "lodash";

@Component({
  selector: "test-dummy",
  providers: [ParseExtrasService],
  templateUrl: "./test-dummy.component.html",
  styleUrls: ["./test-dummy.component.css"]
})
export class TestDummyComponent implements OnInit {
  constructor(
    private _config: ParseExtrasService,
    private _plugs: LoadPluginsService
  ) {}

  config: any = "hallo";
  page: string = "";

  showConfig() {
    this._config.getConfig().subscribe((data: any) => {
      console.log(data);
      this.config = data;
    });

    this._plugs.loadConfigFile();
  }
  ngOnInit() {}
}
