const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const { nodeResolve: rollupPluginResolve } = require('@rollup/plugin-node-resolve');
const rollupPluginScss = require('rollup-plugin-scss');
const rollupPluginIgnoreImport = require('rollup-plugin-ignore-import');
const rollupPluginCommonjs = require('@rollup/plugin-commonjs');
const rollupPluginAlias = require('@rollup/plugin-alias');

module.exports = {
  rollupAlias: (aliasEntries) =>
    rollupPluginAlias({
      entries: aliasEntries,
    }),
  rollupCommonjs: (sourcemap, resolve) =>
    rollupPluginCommonjs({
      sourceMap: sourcemap,
      extensions: resolve.extensions,
    }),
  rollupResolve: (srcPath, resolve) =>
    rollupPluginResolve({
      mainFields: ['browser', 'umd:main', 'module', 'main'],
      rootDir: srcPath,
      moduleDirectories: resolve.directories,
      extensions: resolve.extensions,
    }),
  rollupScss: (extractStyleOption, output) => {
    if (extractStyleOption) {
      return output
        ? rollupPluginScss({
            output,
            processor: () => postcss([autoprefixer()]),
          })
        : rollupPluginIgnoreImport({
            extensions: ['.scss', '.sass', '.css'],
            body: 'export default undefined;',
          });
    }
  },
};
