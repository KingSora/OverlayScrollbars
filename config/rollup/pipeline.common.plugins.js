const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const { nodeResolve: rollupPluginResolve } = require('@rollup/plugin-node-resolve');
const rollupPluginScss = require('rollup-plugin-scss');
const rollupPluginIgnoreImport = require('rollup-plugin-ignore-import');
const rollupPluginCommonjs = require('@rollup/plugin-commonjs');
const rollupPluginAlias = require('@rollup/plugin-alias');
const { extensions, directories } = require('../../resolve.config.json');

module.exports = {
  rollupAlias: (aliasEntries) =>
    rollupPluginAlias({
      entries: aliasEntries,
    }),
  rollupCommonjs: (sourcemap) =>
    rollupPluginCommonjs({
      sourceMap: sourcemap,
      extensions,
    }),
  rollupResolve: (srcPath) =>
    rollupPluginResolve({
      mainFields: ['browser', 'umd:main', 'module', 'main'],
      rootDir: srcPath,
      moduleDirectories: directories,
      extensions,
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
