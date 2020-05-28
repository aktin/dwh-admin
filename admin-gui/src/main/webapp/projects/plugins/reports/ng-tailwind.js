module.exports = {
  // Tailwind Paths
  // using the config in main project.
  configJS: './tailwind.config.js',
  sourceCSS: './src/tailwind/tailwind.scss',
  outputCSS: './src/app/main.css',
  // Sass
  sass: true,
  // PurgeCSS Settings
  purge: true,
  keyframes: false,
  fontFace: false,
  rejected: false,
  whitelist: [],
  whitelistPatterns: [],
  whitelistPatternsChildren: []
}
