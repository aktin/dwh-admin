import angular from 'rollup-plugin-angular';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default [{
   input: 'src/main.ts',
   output: {
     // file: '../../core-app/src/assets/plugins/plugin-1.bundle.js',
     file: '../../main/src/assets/plugins/case.bundle.js',
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
     commonjs()
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
     'material',
   ]
}]