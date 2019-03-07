import {
  Component,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  Injector
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "admin-gui-load-external",
  template: "hallo external<br> <div #content></div>"
})
export class LoadExternalComponent implements AfterViewInit {
  @ViewChild("content", { read: ViewContainerRef }) content: ViewContainerRef;
  constructor(private _route: ActivatedRoute, private _injector: Injector) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._route.data.subscribe(data => {
        let factory = data["factory"];
        if (factory) {
          console.log(factory, factory.inputs, factory.outputs);
          let pluginComponent = this.content.createComponent(
            factory,
            0,
            this._injector
          );
        }
      });
    });
  }
}
