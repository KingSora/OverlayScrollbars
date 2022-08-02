const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const { nodeResolve: rollupPluginResolve } = require('@rollup/plugin-node-resolve');
const { babel: rollupBabelInputPlugin } = require('@rollup/plugin-babel');
const rollupPluginScss = require('rollup-plugin-scss');
const rollupPluginIgnoreImport = require('rollup-plugin-ignore-import');
const rollupPluginCommonjs = require('@rollup/plugin-commonjs');
const rollupPluginAlias = require('@rollup/plugin-alias');
const rollupPluginTs = require('rollup-plugin-typescript2');
const { default: rollupPluginEsBuild } = require('rollup-plugin-esbuild');
const rollupPluginLicense = require('rollup-plugin-license');
const babelConfigUmd = require('./babel.config.umd');
const babelConfigEsm = require('./babel.config.esm');

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
  rollupScss: (banner, sourceMap, extractStyleOption, output) => {
    if (extractStyleOption) {
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
            processor: () => postcss([autoprefixer()]),
          })
        : rollupPluginIgnoreImport({
            extensions: ['.scss', '.sass', '.css'],
            body: 'export default undefined;',
          });
    }
  },
  rollupEsBuild: () =>
    rollupPluginEsBuild({
      include: /\.[jt]sx?$/,
      sourceMap: true,
      target: 'es6',
      tsconfig: './tsconfig.json',
    }),
  rollupBabel: (resolve, esm) =>
    rollupBabelInputPlugin({
      ...(esm ? babelConfigEsm : babelConfigUmd),
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
      shouldPrintComment: () => false,
      caller: {
        name: 'babel-rollup-build',
      },
      extensions: resolve.extensions,
    }),
  rollupTs: (srcPath, declaration) =>
    rollupPluginTs({
      tsconfigOverride: {
        compilerOptions: {
          declaration,
          emitDeclarationOnly: declaration,
          declarationMap: declaration,
        },
        // files to include / exclude from typescript .d.ts generation
        include: [`${srcPath}/**/*`],
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
