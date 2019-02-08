import {
  AfterViewInit,
  Compiler,
  Component,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import _ from "lodash";

declare const SystemJS: any;

@Component({
  selector: "extra-modules",
  templateUrl: "./extra-modules.component.html",
  styleUrls: ["./extra-modules.component.css"]
})
export class ExtraModulesComponent implements AfterViewInit {
  @ViewChild("content", { read: ViewContainerRef }) content: ViewContainerRef;
  @ViewChild("one") d1: ElementRef;

  plugs = [
    // { url: "assets/plugins/plugin-a.bundle.js", moduleName: "PluginAModule" },
    { url: "assets/plugins/plugin-1.bundle.js", moduleName: "Plugin1Module" },
    { url: "assets/plugins/plugin-2.bundle.js", moduleName: "Plugin2Module" },
    {
      url: "http://ulicor.de/files/plugin-a.bundle.js",
      moduleName: "PluginAModule"
    }
  ];

  elements: HTMLElement[] = [];
  components: any = {};

  constructor(
    private _compiler: Compiler,
    private _injector: Injector,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    _.forEach(this.plugs, (plug, index) => {
      this.loadMultiPlugin(plug.url, plug.moduleName);
    });
    let i = 2;
    //this.loadPlugin(this.content, this.plugs[i].url, this.plugs[i].moduleName);

    console.log(this.elements);
    console.log(this.components);
  }

  private async loadPluginComponentFactory(url: string, moduleName: string) {
    // import external module bundle
    const module = await SystemJS.import(url);

    // compile module
    const moduleFactory = await this._compiler.compileModuleAsync<any>(
      module[moduleName]
    );

    // resolve component factory
    const moduleRef = moduleFactory.create(this._injector);
    // const componentProvider = moduleRef.injector.get("plugins");

    const componentProvider = moduleRef.injector.get<PluginDeclaration>(
      // @ts-ignore
      "plugins",
      "No Injector Found - error"
    );
    //from plugins array load the component on position 0
    return moduleRef.componentFactoryResolver.resolveComponentFactory<any>(
      componentProvider[0][0].component
    );
  }

  private async loadPlugin(
    content: ViewContainerRef,
    url: string,
    moduleName: string
  ) {
    const componentFactory = await this.loadPluginComponentFactory(
      url,
      moduleName
    );
    content.createComponent(componentFactory);
  }

  private async loadMultiPlugin(url: string, moduleName: string) {
    const componentFactory = await this.loadPluginComponentFactory(
      url,
      moduleName
    );

    var curComp = componentFactory.create(this._injector);
    var currentElement = (curComp.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    this.elements.push(currentElement);
    this.components[moduleName] = curComp.instance;

    this.content.insert(curComp.hostView);

    //this._renderer.appendChild(this.d1.nativeElement, currentElement);
  }
}

interface PluginDeclaration {
  name;
  component;
}
