import { Compiler, Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import _ from "lodash";
declare const SystemJS: any;

export interface PluginConfig {
  url: string;
  moduleName: string;
  path: string;
}

@Injectable({
  providedIn: "root"
})
export class LoadPluginsService {
  constructor(
    private _http: HttpClient,
    private _compiler: Compiler,
    private _injector: Injector
  ) {}

  components: any = {};
  configUrl = "assets/extras.json";

  getConfig() {
    return this._http.get(this.configUrl);
  }

  loadConfigFile() {
    this._http.get(this.configUrl).subscribe((data: any) => {
      console.log(123);
      console.log(data["plugins"]);
      var plugins: PluginConfig[] = data["plugins"];
      _.forEach(plugins, plug => {
        console.log(plug.moduleName);
        this.loadPlugin(plug);
      });
    });
  }

  async loadPlugin(plug: PluginConfig) {
    this.components[plug.moduleName] = await this.loadPluginComponent(plug);
    console.log(this.components);
  }

  private async loadPluginComponent(plug: PluginConfig) {
    // import external module bundle
    const module = await SystemJS.import(plug.url);
    console.log(plug.moduleName, module, plug.url);
    // compile module
    const moduleFactory = await this._compiler.compileModuleAsync<any>(
      module[plug.moduleName]
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
    const componentFactory = await moduleRef.componentFactoryResolver.resolveComponentFactory<
      any
    >(componentProvider[0][0].component);

    return componentFactory.create(this._injector).instance;
    // this.components[plug.moduleName] = curComp.instance;
  }
}

interface PluginDeclaration {
  name;
  component;
}
