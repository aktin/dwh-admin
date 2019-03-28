import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "@app/app.module";
import { environment } from "@env/environment";

declare const SystemJS: any;

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
import * as material from "material";

SystemJS.set("@angular/core", SystemJS.newModule(angularCore));
SystemJS.set("@angular/common", SystemJS.newModule(angularCommon));
SystemJS.set("@angular/router", SystemJS.newModule(angularRouter));
SystemJS.set("@angular/forms", SystemJS.newModule(angularForms));
SystemJS.set("@ngrx/store", SystemJS.newModule(ngrxStore));
SystemJS.set("@ngrx/effects", SystemJS.newModule(ngrxEffects));
SystemJS.set("@ngrx/entity", SystemJS.newModule(ngrxEntity));
SystemJS.set("@ngrx/router-store", SystemJS.newModule(ngrxRouterStore));
SystemJS.set("@aktin/utils", SystemJS.newModule(aktinUtils));
SystemJS.set("rxjs", SystemJS.newModule(rxjs));
SystemJS.set("lodash", SystemJS.newModule(lodash));
SystemJS.set("material", SystemJS.newModule(material));

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
