import angular from 'rollup-plugin-angular';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default [{
   input: 'src/main.ts',
   output: {
     file: '../../main/src/assets/plugins/reports.bundle.js',
     format: 'umd',
     name: 'case',
},
   plugins: [
     angular(),
     resolve({
        jsnext: true,
        main: true,
        // pass custom options to the resolve plugin
        customResolveOptions: {
           moduleDirectory: 'node_modules'
        }
     }),
     typescript({
       typescript: require('typescript')
     }),
     commonjs(),
     json()
   ],
   external: [
     '@angular/core',
     '@angular/common',
     '@angular/router',
     '@ngrx/store',
     '@ngrx/effects',
     '@ngrx/entity',
     '@ngrx/router-store',
     '@aktin/utils',
     'rxjs',
     'lodash',
     'file-saver',
   ]
}]
