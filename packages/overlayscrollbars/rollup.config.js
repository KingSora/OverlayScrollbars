const { dirname, basename, resolve } = require('path');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const { summary } = require('rollup-plugin-summary');
const createRollupConfig = require('@~local/rollup');
const { devDependencies, peerDependencies, version } = require('./package.json');

module.exports = createRollupConfig({
  project: 'OverlayScrollbars',
  verbose: true,
  extractStyles: true,
  extractTypes: true,
  versions: [
    {
      format: 'cjs',
      generatedCode: 'es2015',
      outputSuffix: '.cjs',
      minifiedVersion: true,
    },
    {
      format: 'esm',
      generatedCode: 'es2015',
      outputSuffix: '.esm',
      minifiedVersion: true,
    },
    {
      format: 'iife',
      generatedCode: 'es2015',
      outputSuffix: '.browser.es6',
      minifiedVersion: true,
      file: (originalPath) =>
        `${resolve(dirname(originalPath), 'browser', basename(originalPath))}`,
    },
    {
      format: 'iife',
      generatedCode: 'es5',
      outputSuffix: '.browser.es5',
      minifiedVersion: true,
      file: (originalPath) =>
        `${resolve(dirname(originalPath), 'browser', basename(originalPath))}`,
    },
  ],
  banner: `OverlayScrollbars
Version: ${version}

Copyright (c) Rene Haas | KingSora.
https://github.com/KingSora

Released under the MIT license.`,
  rollup: {
    external: Object.keys(devDependencies || {}).concat(Object.keys(peerDependencies || {})),
    output: {
      exports: 'auto',
      sourcemap: true,
      plugins: [
        rollupTerser({
          safari10: true,
          mangle: {
            safari10: true,
            keep_fnames: true, // eslint-disable-line camelcase
            properties: {
              regex: /^_/,
            },
          },
          compress: {
            defaults: false,
            hoist_funs: true, // eslint-disable-line camelcase
          },
          format: {
            beautify: true,
            max_line_len: 80, // eslint-disable-line camelcase
            braces: true,
            indent_level: 2, // eslint-disable-line camelcase
            comments: 'all',
            preserve_annotations: true, // eslint-disable-line camelcase
          },
        }),
      ],
    },
    plugins: [
      summary({
        showGzippedSize: true,
        showBrotliSize: true,
        showMinifiedSize: false,
        warnLow: 30000,
        totalLow: 30000,
        warnHigh: 35000,
        totalHigh: 35000,
      }),
    ],
    treeshake: {
      propertyReadSideEffects: false,
      moduleSideEffects: false,
      annotations: false,
    },
  },
});
