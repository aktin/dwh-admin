/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'lib/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            'app': 'app',

            // angular bundles
            '@angular/core':                      'npm:@angular/core/core.umd.min.js',
            '@angular/common':                    'npm:@angular/common/common.umd.min.js',
            '@angular/compiler':                  'npm:@angular/compiler/compiler.umd.min.js',
            '@angular/platform-browser':          'npm:@angular/platform-browser/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic':  'npm:@angular/platform-browser-dynamic/platform-browser-dynamic.umd.min.js',
            '@angular/http':                      'npm:@angular/http/http.umd.min.js',
            '@angular/router':                    'npm:@angular/router/router.umd.min.js',
            '@angular/forms':                     'npm:@angular/forms/forms.umd.min.js',

            // other libraries
            'angular-in-memory-web-api':  'npm:angular-in-memory-web-api/in-memory-web-api.umd.js',
            'rxjs':                       'npm:rxjs',
            'underscore':                 'npm:underscore/underscore-min.js',
            'jquery':                     'npm:jquery/jquery.slim.min.js',
            'file-saver':                 'npm:file-saver/FileSaver.js',
            'mydatepicker':               'npm:mydatepicker/mydatepicker.umd.js',
            'semantic-ui':                'npm:semantic-ui/semantic.min.js'
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
