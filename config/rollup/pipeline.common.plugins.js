const { nodeResolve: rollupPluginResolve } = require('@rollup/plugin-node-resolve');
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
};
