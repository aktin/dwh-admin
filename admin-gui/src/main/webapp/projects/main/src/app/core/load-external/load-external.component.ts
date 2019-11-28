import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Injector, ViewRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ExternalDirective } from "@app/core/load-external/external.directive";

@Component({
  selector: "admin-gui-load-external",
  // template: "hallo external<br> <div #content></div>"
  template: `hallo external<br> <ng-template external> hier data</ng-template>`
})
export class LoadExternalComponent implements OnInit {
  @ViewChild(ExternalDirective, {static: true }) external: ExternalDirective;
  constructor(private _route: ActivatedRoute, private _injector: Injector) {}

  ngOnInit(): void {

    const viewContainerRef = this.external.viewContainerRef;

      this._route.data.subscribe(data => {
          console.log(data)
        let factory = data["factory"];

        if (factory) {

          // viewContainerRef.clear();
          // const comp = factory.create(this._injector, [], null, data["module"]);
          //
          // console.log(comp.hostView, comp );
          // viewContainerRef.insert(comp.hostView);
          const pluginComponent = viewContainerRef.createComponent(factory, 0, this._injector, [], data["module"]);
        }
      });
  }
}
