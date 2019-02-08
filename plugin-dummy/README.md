# Angular Plugin Architecture Example
This project represents an example of how to achieve a plugin architecture in angular.

# Article related: 

# Setup 
In Plugin Folder:
> cd plugins/plugin-a
```
npm install
npm run build
```

https://itnext.io/how-to-build-a-plugin-extensible-application-architecture-in-angular5-736890278f3f


-------
# To Change :
* in `rollup.config.js` the name of the bundle
* in `main.ts` the imported name of the module
* in `app/dummy-plugin.module.ts` the imported and declared components 
and the exported injectable components as part of plugins. Multiple components possible
* in the components


--------
additional: 
> in `node_modules/rollup-plugin-angular/package.json` change the version of `replace` to 1.0.1
if there are errors during install. May not be neccessary
