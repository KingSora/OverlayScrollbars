const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { nodeResolve: rollupPluginResolve } = require('@rollup/plugin-node-resolve');
const { babel: rollupBabelInputPlugin } = require('@rollup/plugin-babel');
const rollupPluginScss = require('rollup-plugin-scss');
const rollupPluginIgnoreImport = require('rollup-plugin-ignore-import');
const rollupPluginCommonjs = require('@rollup/plugin-commonjs');
const rollupPluginAlias = require('@rollup/plugin-alias');
const rollupPluginTs = require('rollup-plugin-typescript2');
const rollupPluginLicense = require('rollup-plugin-license');
const rollupPluginEsBuild = require('../plugins/esbuild');
const rollupPluginEsBuildResolve = require('../plugins/esbuild-resolve');
const babelConfigEs5 = require('./babel.config.es5');
const babelConfigEs6 = require('./babel.config.es2015');

const normalizePath = (pathName) =>
  pathName ? pathName.split(path.sep).join(path.posix.sep) : pathName;

module.exports = {
  rollupAlias: (resolve, aliasEntries) =>
    rollupPluginAlias({
      entries: [
        ...Object.entries(aliasEntries).reduce((arr, [key, value]) => {
          arr.push({
            find: key,
            replacement: value,
          });
          return arr;
        }, []),
      ],
    }),
  rollupCommonjs: (sourcemap, resolve) =>
    rollupPluginCommonjs({
      sourceMap: sourcemap,
      extensions: resolve.extensions,
    }),
  rollupResolve: (resolve, resolveOnly) =>
    rollupPluginResolve({
      mainFields: ['browser', 'umd:main', 'module', 'main'],
      moduleDirectories: resolve.directories,
      extensions: resolve.extensions,
      ignoreSideEffectsForRoot: true,
      ...(resolveOnly ? { resolveOnly } : {}),
    }),
  rollupEsbuildResolve: (resolve) =>
    rollupPluginEsBuildResolve({
      esbuild: {
        mainFields: ['browser', 'umd:main', 'module', 'main'],
        nodePaths: resolve.directories,
        resolveExtensions: resolve.extensions,
      },
    }),
  rollupScss: (resolve, sourceMap, extract, output, banner, minified) => {
    if (extract) {
      return output
        ? rollupPluginScss({
            output,
            sourceMap,
            sass,
            prefix: banner
              ? `/*! \r\n${banner
                  .replace(/\r\n/g, '\r')
                  .replace(/\n/g, '\r')
                  .split(/\r/)
                  .map((line) => ` * ${line}\r\n`)
                  .join('')} */`
              : undefined,
            processor: () => postcss([autoprefixer()].concat(minified ? cssnano() : [])),
          })
        : rollupPluginIgnoreImport({
            extensions: resolve.styleExtensions,
            body: 'export default undefined;',
          });
    }
  },
  rollupEsBuild: (sourcemap) =>
    rollupPluginEsBuild({
      sourcemap,
      target: 'es6',
    }),
  rollupBabel: (resolve, es6) =>
    rollupBabelInputPlugin({
      ...(es6 ? babelConfigEs6 : babelConfigEs5),
      assumptions: {
        enumerableModuleMeta: false,
        constantReexports: true,
        iterableIsArray: true,
        objectRestNoSymbols: true,
        noNewArrows: true,
        noClassCalls: true,
        ignoreToPrimitiveHint: true,
        ignoreFunctionLength: true,
        // privateFieldsAsProperties: true,
        // setPublicClassFields: true,
        setSpreadProperties: true,
        pureGetters: true,
      },
      plugins: [
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
      ],
      babelHelpers: 'runtime',
      shouldPrintComment: (comment) => /@__PURE__/.test(comment),
      caller: {
        name: 'babel-rollup-build',
      },
      extensions: resolve.extensions,
    }),
  rollupTs: (input, declaration) =>
    rollupPluginTs({
      tsconfigOverride: {
        compilerOptions: {
          declaration,
          emitDeclarationOnly: declaration,
          declarationMap: declaration,
        },
        // files to include / exclude from typescript .d.ts generation
        include: [`${normalizePath(path.dirname(path.resolve(input)))}/**/*`],
        exclude: ['node_modules', '**/node_modules/*', '*.d.ts', '**/*.d.ts'],
      },
      clean: true,
      // files to include / exclude from the plugin
      include: ['*.ts+(|x)', '**/*.ts+(|x)'],
      exclude: ['node_modules', '**/node_modules/*', '*.d.ts', '**/*.d.ts'],
    }),
  rollupLicense: (content, sourceMap) =>
    content &&
    rollupPluginLicense({
      sourcemap: sourceMap,
      banner: {
        content,
        commentStyle: 'ignored',
      },
    }),
};
