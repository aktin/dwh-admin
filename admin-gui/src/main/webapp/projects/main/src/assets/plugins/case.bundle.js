(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@aktin/utils')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@aktin/utils'], factory) :
    (global = global || self, factory(global.case = {}, global.core, global.common, global.utils));
}(this, function (exports, core, common, utils) { 'use strict';

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

    var CaseComponent = /** @class */ (function () {
        function CaseComponent(_url) {
            this._url = _url;
            this.state = { link: "" };
            console.log(this._url.link(["HOME"]));
            this.state.link = this.getUrls("REPORT", "SINGLE");
        }
        CaseComponent.prototype.getUrls = function () {
            var routes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                routes[_i] = arguments[_i];
            }
            if (!this._url)
                return routes.join("/");
            return "#" + this._url.link(routes);
        };
        CaseComponent = __decorate([
            core.Component({
                selector: "case-component",
                template: "enquire\n<a href=\"{{state.link}}\">link to report single?</a>\n",
                styles: ["table {\n    font-family: arial, sans-serif;\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntd, th {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 8px;\n}\n\ntr:nth-child(even) {\n    background-color: #dddddd;\n}\n"],
            }),
            __metadata("design:paramtypes", [utils.UrlService])
        ], CaseComponent);
        return CaseComponent;
    }());

    var PLUGIN_NAME = "Case";
    var PATH = "case";
    var ROUTE_NAME = "CASE";
    var ROUTES_NAMES = {
        HOME: { path: "" },
        SUB: { path: "sub" },
    };
    var ROUTES = {
        HOME: {
            component: CaseComponent,
        },
        SUB: {
            component: CaseComponent,
        },
        DEFAULT: {
            path: "**",
            redirectTo: "",
            pathMatch: "full",
        },
    };

    var MainModule = /** @class */ (function () {
        function MainModule() {
        }
        MainModule = __decorate([
            core.NgModule({
                imports: [common.CommonModule],
                declarations: [CaseComponent],
                entryComponents: [CaseComponent],
                providers: [
                    {
                        provide: "plugins",
                        useValue: [
                            {
                                name: "METADATA",
                                routeName: ROUTE_NAME,
                                routesNames: ROUTES_NAMES,
                                routes: ROUTES,
                                pluginName: PLUGIN_NAME,
                                path: PATH,
                            },
                        ],
                        multi: true,
                    },
                ],
            })
        ], MainModule);
        return MainModule;
    }());

    exports.MainModule = MainModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
