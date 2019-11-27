import { Compiler, Injectable, Injector, NgModuleFactory } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Routes } from "@angular/router";
import _ from "lodash";
import { ROUTE_REDUCE } from "@app/routing/names";
import { Observable } from "rxjs";

// declare const SystemJS: any;
import * as angularCore from "@angular/core";
import * as angularCommon from "@angular/common";
import * as angularRouter from "@angular/router";
import * as angularForms from "@angular/forms";
import * as ngrxStore from "@ngrx/store";
import * as ngrxEffects from "@ngrx/effects";
import * as ngrxEntity from "@ngrx/entity";
import * as ngrxRouterStore from "@ngrx/router-store";
import * as aktinUtils from "@aktin/utils";
import * as rxjs from "rxjs";
import * as lodash from "lodash";
import * as fileSaver from "file-saver";

export interface PluginConfig {
  url: string;
  moduleName?: string;
}

@Injectable({
  providedIn: "root",
})
export class LoadPluginsService {
  constructor(
    private _http: HttpClient,
    private _compiler: Compiler,
    private _injector: Injector,
  ) {}

  modules: any = {};
  configUrl = "assets/extras.json";
  routes: Routes = [];
  plugins: PluginConfig[] = null;
  routeNames = {};
  pluginStates = {};
  pluginInitialStates = {};
  loading = true;

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

  get pluginLoading() {
    return this.loading;
  }

  awaitLoad(): Promise<boolean> {
    // console.log("are the plugins loading?");
    if (this.loading === false) {
      // console.log("are the plugins loading done");
      return Promise.resolve(true);
    }
    return new Promise<boolean>(resolve => {
      this.timeoutTillFalse(200, resolve);
    });
  }

  timeoutTillFalse(time: number, callback) {
    if (this.loading) {
      return setTimeout(() => {
        this.timeoutTillFalse(time, callback);
      }, time);
    }
    // console.log("plugins loaded!");
    callback();
  }

  async loadConfigFile(pathComponent: any) {
    let data = await this._http.get(this.configUrl).toPromise();
    this.plugins = data["plugins"];
    await this.asyncForEach(this.plugins, async plug => {
      await this.loadPlugin(plug, pathComponent);
    });
    console.log("all plugins loaded");
    this.loading = false;
  }

  async loadPlugin(plug: PluginConfig, pathComponent: any) {

    if (!plug.moduleName) plug.moduleName = "MainModule";

    // import external module bundle
    let response: Response = await fetch(plug.url);
    let source =  await response.text();
    const exports = {};
    const modules = {
      '@angular/core': angularCore,
      '@angular/common': angularCommon,
      '@angular/router': angularRouter,
      '@angular/forms': angularForms,
      '@ngrx/store': ngrxStore,
      '@ngrx/effects': ngrxEffects,
      '@ngrx/entity': ngrxEntity,
      '@ngrx/router-store': ngrxRouterStore,
      '@aktin/utils': aktinUtils,
      'rxjs': rxjs,
      'lodash': lodash,
      'fileSaver': fileSaver,
    };

    const require: any = (module) => modules[module];
    eval(source);

    console.log(exports, source);

    // compile module
    const moduleFactory = await this._compiler.compileModuleAsync<any>(exports[plug.moduleName]);

    // const moduleFactory: NgModuleFactory<any> = exports[plug.moduleName];

    //*/
    const moduleRef = await moduleFactory.create(this._injector);
    // const componentProvider = moduleRef.injector.get("plugins");
    const componentProvider = moduleRef.injector.get<PluginDeclaration>(
      // @ts-ignore
      "plugins",
      "No Injector Found - error",
    );

    this.modules[plug.moduleName] = moduleRef;

    // const componentFactory = await moduleRef.componentFactoryResolver.resolveComponentFactory<any>(componentProvider[0][0].component);
    // this.componentFactory[plug.moduleName] = componentFactory;
    // const component = await componentFactory.create(this._injector);
    // this.components[plug.moduleName] = component;

    let provider = _.clone(componentProvider[0]);

    // console.log(componentProvider[0]);
    let metadata = _.remove(provider, item => {
      return item.name.includes("METADATA");
    })[0];
    if (!metadata) metadata = {};

    let routeName = metadata["routeName"] || plug.moduleName.toUpperCase();

    let routeNameObj = {
      path: metadata["path"] || plug.moduleName,
      name: metadata["pluginName"] || plug.moduleName,
    };

    if (metadata["store"]) {
      this.pluginStates[routeNameObj.name] = metadata["store"]["state"];
      this.pluginInitialStates[routeNameObj.name] = metadata["store"]["initial"];
    }

    if (metadata["routesNames"]) {
      routeNameObj["children"] = metadata["routesNames"];
    }
    this.routeNames[routeName] = routeNameObj;

    let route = {
      path: routeNameObj.path,
      data: {
        name: routeNameObj.name,
        plugin: plug.moduleName,
      },
    };

    if (!metadata["routes"]) {
      // no routes, just load the component of the first item from the plugins array
      route.data["component"] = provider[0].component;
      route["component"] = pathComponent;
      route.data["factory"] = await moduleRef.componentFactoryResolver.resolveComponentFactory<any>(
        route.data["component"],
      );
    } else {
      let children = metadata["routes"];
      _.each(children, item => {
        if (!item.component) return;
        if (!item.data) item.data = {};
        item.data["component"] = item.component;
        item["component"] = pathComponent;
      });

      route["children"] = ROUTE_REDUCE(children, metadata["routesNames"], [routeName], route.path);
      route["childrenObj"] = children;
      await this.asyncForEachObject(children, async item => {
        if (!item.data["component"]) return;
        item.data["factory"] = await moduleRef.componentFactoryResolver.resolveComponentFactory<
          any
        >(item.data["component"]);
      });
    }

    this.routes.push(route);

    console.log("- ", routeNameObj.name, "plugin loaded");
  //*/
  }

}

interface PluginDeclaration {
  name;
  component;
}
