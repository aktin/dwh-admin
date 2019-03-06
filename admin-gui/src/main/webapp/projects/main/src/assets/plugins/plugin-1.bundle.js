(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(
        exports,
        require("@angular/core"),
        require("@angular/common"),
        require("@angular/forms")
      )
    : typeof define === "function" && define.amd
    ? define([
        "exports",
        "@angular/core",
        "@angular/common",
        "@angular/forms"
      ], factory)
    : factory(
        (global["plugin-1"] = {}),
        global.core,
        global.common,
        global.forms
      );
})(this, function(exports, core, common, forms) {
  "use strict";

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
  /* global Reflect, Promise */

  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(metadataKey, metadataValue);
  }

  var Plugin1Component = /** @class */ (function() {
    function Plugin1Component() {}
    Plugin1Component = __decorate(
      [
        core.Component({
          selector: "plugin-1-component",
          template:
            '<div class="plugin-1-main">\n  <table>\n    <tr>\n      <th>Company</th>\n      <th>Contact</th>\n      <th>Country</th>\n    </tr>\n    <tr>\n      <td>Alfreds Futterkiste</td>\n      <td>Maria Anders</td>\n      <td>Germany</td>\n    </tr>\n    <tr>\n      <td>Centro comercial Moctezuma</td>\n      <td>Francisco Chang</td>\n      <td>Mexico</td>\n    </tr>\n    <tr>\n      <td>Ernst Handel</td>\n      <td>Roland Mendel</td>\n      <td>Austria</td>\n    </tr>\n    <tr>\n      <td>Island Trading</td>\n      <td>Helen Bennett</td>\n      <td>UK</td>\n    </tr>\n    <tr>\n      <td>Laughing Bacchus Winecellars</td>\n      <td>Yoshi Tannamuri</td>\n      <td>Canada</td>\n    </tr>\n    <tr>\n      <td>Magazzini Alimentari Riuniti</td>\n      <td>Giovanni Rovelli</td>\n      <td>Italy</td>\n    </tr>\n  </table>\n\n</div>\n',
          styles: [
            "table {\n    font-family: arial, sans-serif;\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntd, th {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 8px;\n}\n\ntr:nth-child(even) {\n    background-color: #dddddd;\n}\n"
          ]
        }),
        __metadata("design:paramtypes", [])
      ],
      Plugin1Component
    );
    return Plugin1Component;
  })();

  var Plugin1Module = /** @class */ (function() {
    function Plugin1Module() {}
    Plugin1Module = __decorate(
      [
        core.NgModule({
          imports: [common.CommonModule, forms.FormsModule],
          declarations: [Plugin1Component],
          entryComponents: [Plugin1Component],
          providers: [
            {
              provide: "plugins",
              useValue: [
                {
                  name: "plugin-1-component",
                  component: Plugin1Component
                }
              ],
              multi: true
            }
          ]
        })
      ],
      Plugin1Module
    );
    return Plugin1Module;
  })();

  exports.Plugin1Module = Plugin1Module;

  Object.defineProperty(exports, "__esModule", { value: true });
});
