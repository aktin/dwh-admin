import { Compiler, Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Route, Routes } from "@angular/router";

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
  componentFactory: any = {};
  modules: any = {};
  configUrl = "assets/extras.json";
  routes: Routes = [];
  plugins: PluginConfig[] = null;

  async asyncForEach(array, callback) {
    // console.log(array);
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async loadConfigFile(pathComponent: any) {
    let data = await this._http.get(this.configUrl).toPromise();
    this.plugins = data["plugins"];
    await this.asyncForEach(this.plugins, async plug => {
      await this.loadPlugin(plug, pathComponent);
    });
  }

  async loadPlugin(plug: PluginConfig, pathComponent: any) {
    // import external module bundle
    const module = await SystemJS.import(plug.url);

    // console.log(plug.moduleName, module, plug.url);
    // compile module
    const moduleFactory = await this._compiler.compileModuleAsync<any>(
      module[plug.moduleName]
    );

    const moduleRef = await moduleFactory.create(this._injector);

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

    // console.log(componentProvider);
    const component = await componentFactory.create(this._injector);

    this.components[plug.moduleName] = component;
    this.componentFactory[plug.moduleName] = componentFactory;
    this.modules[plug.moduleName] = moduleRef;

    let route = {
      path: plug.path,
      component: pathComponent,
      data: {
        name: plug.name,
        plugin: plug.moduleName,
        factory: componentFactory
      }
    };
    if (componentProvider[0].length >= 2) {
      // console.log(componentProvider[0][1].component);
      route["children"] = componentProvider[0][1].component;
    }

    this.routes.push(route);
  }
}

interface PluginDeclaration {
  name;
  component;
}
