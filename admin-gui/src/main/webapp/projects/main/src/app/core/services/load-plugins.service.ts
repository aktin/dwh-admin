import { Compiler, Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Routes } from "@angular/router";
import _ from "lodash";
import { ROUTE_REDUCE } from "@app/routing";

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
  async asyncForEachObject(obj, callback) {
    // console.log(array);
    for (let key in obj) {
      await callback(obj[key], key, obj);
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

    this.modules[plug.moduleName] = moduleRef;

    // const componentFactory = await moduleRef.componentFactoryResolver.resolveComponentFactory<any>(componentProvider[0][0].component);
    // this.componentFactory[plug.moduleName] = componentFactory;
    // const component = await componentFactory.create(this._injector);
    // this.components[plug.moduleName] = component;

    let provider = _.clone(componentProvider[0]);

    console.log(componentProvider[0]);
    let metadata = _.remove(provider, item => {
      return item.name.includes("METADATA");
    })[0];
    let route = {
      path: plug.path,
      data: {
        name: plug.name,
        plugin: plug.moduleName
      }
    };

    if (!metadata) {
      // no routes, just load the component of the first item from the plugins array
      route.data["component"] = provider[0].component;
      route["component"] = pathComponent;
      route.data[
        "factory"
      ] = await moduleRef.componentFactoryResolver.resolveComponentFactory<any>(
        route.data["component"]
      );
    } else {
      let children = metadata["routes"];
      _.each(children, item => {
        if (!item.component) return;
        if (!item.data) item.data = {};
        item.data["component"] = item.component;
        item["component"] = pathComponent;
      });

      route["children"] = ROUTE_REDUCE(
        children,
        metadata["routesNames"],
        [plug.moduleName.toUpperCase()],
        plug.path
      );

      if (metadata["routesNames"]) {
      }

      await this.asyncForEachObject(children, async item => {
        if (!item.data["component"]) return;
        item.data[
          "factory"
        ] = await moduleRef.componentFactoryResolver.resolveComponentFactory<
          any
        >(item.data["component"]);
      });
    }

    this.routes.push(route);
  }
}

interface PluginDeclaration {
  name;
  component;
}