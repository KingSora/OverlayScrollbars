import path from 'node:path';
import * as sass from 'sass';
import postcss from 'postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import { babel as rollupBabelInputPlugin } from '@rollup/plugin-babel';
import { esbuildResolve as rollupPluginEsBuildResolve } from 'rollup-plugin-esbuild-resolve';
import rollupPluginScss from 'rollup-plugin-scss';
import rollupPluginIgnoreImport from 'rollup-plugin-ignore-import';
import rollupPluginCommonjs from '@rollup/plugin-commonjs';
import rollupPluginVirtual from '@rollup/plugin-virtual';
import rollupPluginTs from 'rollup-plugin-typescript2';
import rollupPluginLicense from 'rollup-plugin-license';
import { rollupEsbuildPlugin } from '../plugins/rollupEsbuildPlugin.js';
import babelConfigEs5 from './babel.config.es5.js';
import babelConfigEs6 from './babel.config.es2015.js';

const normalizePath = (pathName) =>
  pathName ? pathName.split(path.sep).join(path.posix.sep) : pathName;

export default {
  rollupCommonjs: (sourcemap, resolve) =>
    rollupPluginCommonjs({
      sourceMap: sourcemap,
      extensions: resolve.extensions,
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
            sass: {
              renderSync: (options) => {
                return sass.renderSync({ ...options, silenceDeprecations: ['legacy-js-api'] });
              },
            },
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
    rollupEsbuildPlugin({
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
      plugins: ['@babel/plugin-transform-runtime'],
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
  rollupVirtual: (modules) => rollupPluginVirtual(modules),
};
