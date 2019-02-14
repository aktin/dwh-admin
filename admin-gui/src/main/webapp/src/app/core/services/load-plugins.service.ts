import { Compiler, Injectable, Injector, NgModuleRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
declare const SystemJS: any;

export interface PluginConfig {
  url: string;
  moduleName: string;
  path: string;
  name: string;
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
  routes: any = [];
  plugins: PluginConfig[] = null;

  getPluginRouts() {
    return this.routes;
  }

  async asyncForEach(array, callback) {
    console.log(array);
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async loadConfigFile() {
    let data = await this._http.get(this.configUrl).toPromise();
    this.plugins = data["plugins"];
    await this.asyncForEach(this.plugins, async plug => {
      await this.loadPlugin(plug);
    });
  }

  async loadPlugin(plug: PluginConfig) {
    const moduleRef = await this.loadPluginModuleRef(plug);
    const component = await this.getComponentFromModuleRef(moduleRef);
    this.components[plug.moduleName] = component;
    this.routes.push({
      path: plug.path,
      component: component,
      data: {
        name: plug.name
      }
      //loadChildren: moduleRef.instance
    });
  }

  private async loadPluginModuleRef(plug: PluginConfig) {
    // import external module bundle
    const module = await SystemJS.import(plug.url);
    // console.log(plug.moduleName, module, plug.url);
    // compile module
    const moduleFactory = await this._compiler.compileModuleAsync<any>(
      module[plug.moduleName]
    );
    return moduleFactory.create(this._injector);
  }

  private async getComponentFromModuleRef(moduleRef: NgModuleRef<any>) {
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
  }
}

interface PluginDeclaration {
  name;
  component;
}
