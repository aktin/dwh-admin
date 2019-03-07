(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory(global['plugin-2'] = {}, global.core, global.common));
}(this, function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    var Plugin2Component = /** @class */ (function () {
        function Plugin2Component() {
        }
        Plugin2Component.prototype.ngAfterViewInit = function () {
        };
        Plugin2Component = __decorate([
            core.Component({
                selector: 'plugin-2-component',
                template: "<div class=\"plugin-2\">this is the some awesome plugin with <a href=\"#/plugin2/sub\">url</a> and beans beans</div>\n\n"
            }),
            __metadata("design:paramtypes", [])
        ], Plugin2Component);
        return Plugin2Component;
    }());

    var SubComponent = /** @class */ (function () {
        function SubComponent() {
        }
        SubComponent = __decorate([
            core.Component({
                selector: 'sub-component',
                template: "hallo hier ist die subseite des ganzen\n<br>\nund hier die url back <a href=\"#/plugin2\">some link</a>\n"
            }),
            __metadata("design:paramtypes", [])
        ], SubComponent);
        return SubComponent;
    }());

    var PLUGIN_2_ROUTES = {
        HOME: {
            component: Plugin2Component
        },
        SUB: {
            component: SubComponent
        },
        DEFAULT: {
            path: '**',
            redirectTo: '',
            pathMatch: 'full'
        }
    };

    var PLUGIN_2_ROUTES_NAMES = {
        HOME: { path: "" },
        SUB: { path: "sub" }
    };

    var Plugin2Module = /** @class */ (function () {
        function Plugin2Module() {
        }
        Plugin2Module = __decorate([
            core.NgModule({
                imports: [
                    common.CommonModule,
                ],
                declarations: [Plugin2Component, SubComponent],
                entryComponents: [Plugin2Component, SubComponent],
                providers: [{
                        provide: 'plugins',
                        useValue: [
                            {
                                name: 'plugin-2-component',
                                component: Plugin2Component
                            }, {
                                name: 'sub-component',
                                component: SubComponent
                            },
                            {
                                name: 'METADATA',
                                routesNames: PLUGIN_2_ROUTES_NAMES,
                                routes: PLUGIN_2_ROUTES,
                                routeName: "AWESOMEP",
                                pluginName: "Awesome Plugin",
                                path: "plugin2"
                            },
                        ],
                        multi: true
                    }]
            })
        ], Plugin2Module);
        return Plugin2Module;
    }());

    exports.Plugin2Module = Plugin2Module;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
