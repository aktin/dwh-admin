/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'lib/node/',
        // 'underscore':                'node_modules/underscore/underscore.js',
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      'app': 'app',

      // angular bundles
      '@angular/core':                      'npm:@angular/core/core.umd.js',
      '@angular/common':                    'npm:@angular/common/common.umd.js',
      '@angular/compiler':                  'npm:@angular/compiler/compiler.umd.js',
      '@angular/platform-browser':          'npm:@angular/platform-browser/platform-browser.umd.js',
      '@angular/platform-browser-dynamic':  'npm:@angular/platform-browser-dynamic/platform-browser-dynamic.umd.js',
      '@angular/http':                      'npm:@angular/http/http.umd.js',
      '@angular/router':                    'npm:@angular/router/router.umd.js',
      '@angular/forms':                     'npm:@angular/forms/forms.umd.js',

      // other libraries
      'underscore':                'npm:underscore/underscore-min.js',
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'systemjs-angular-loader.js'
          }
        }
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);
