import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "admin-gui-load-external",
  template: "hallo external <div #content></div>"
})
export class LoadExternalComponent implements AfterViewInit {
  @ViewChild("content", { read: ViewContainerRef }) content: ViewContainerRef;
  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this._route.data.subscribe(data => {
      let factory = data["factory"];
      if (factory) {
        this.content.createComponent(factory);
      }
    });
  }
}
