(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory(global.enquire = {}, global.core, global.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
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

    var EnquireComponent = /** @class */ (function () {
        function EnquireComponent() {
        }
        EnquireComponent = __decorate([
            core.Component({
                selector: "enquire-component",
                template: "enquire\n<!--<a href=\"{{state.link}}\">link to report single?</a>-->\n",
                styles: ["table {\n    font-family: arial, sans-serif;\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntd, th {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 8px;\n}\n\ntr:nth-child(even) {\n    background-color: #dddddd;\n}\n"]
            }),
            __metadata("design:paramtypes", [])
        ], EnquireComponent);
        return EnquireComponent;
    }());

    var PLUGIN_NAME = "ENQuIRE";
    var PATH = "enquire";
    var ROUTE_NAME = "ENQUIRE";
    var ROUTES_NAMES = {
        HOME: { path: "" },
        SUB: { path: "sub" }
    };
    var ROUTES = {
        HOME: {
            component: EnquireComponent
        },
        SUB: {
            component: EnquireComponent
        },
        DEFAULT: {
            path: "**",
            redirectTo: "",
            pathMatch: "full"
        }
    };

    var MainModule = /** @class */ (function () {
        function MainModule() {
        }
        MainModule = __decorate([
            core.NgModule({
                imports: [common.CommonModule],
                declarations: [EnquireComponent],
                entryComponents: [EnquireComponent],
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
                                path: PATH
                            }
                        ],
                        multi: true
                    }
                ]
            })
        ], MainModule);
        return MainModule;
    }());

    exports.MainModule = MainModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
