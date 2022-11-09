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
  clean: true,
  copy: ['README.md', 'CHANGELOG.md'],
  extractPackageJson: {
    json: ({
      name,
      version: v,
      description,
      author,
      license,
      homepage,
      bugs,
      repository,
      keywords,
    }) => {
      return {
        name,
        version: v,
        description,
        author,
        license,
        homepage,
        bugs,
        repository,
        keywords,
        main: 'overlayscrollbars.cjs.js',
        module: 'overlayscrollbars.esm.js',
        types: 'types/overlayscrollbars.d.ts',
        exports: {
          '.': {
            require: './overlayscrollbars.cjs',
            import: './overlayscrollbars.mjs',
            types: './types/overlayscrollbars.d.ts',
          },
          './overlayscrollbars.css': './styles/overlayscrollbars.css',
        },
        sideEffects: ['*.css', '*.scss', '*.sass'],
      };
    },
  },
  versions: [
    {
      format: 'cjs',
      generatedCode: 'es2015',
      extension: '.cjs.js',
      minifiedVersion: false,
    },
    {
      format: 'esm',
      generatedCode: 'es2015',
      extension: '.esm.js',
      minifiedVersion: false,
    },
    {
      format: 'cjs',
      generatedCode: 'es2015',
      extension: '.cjs',
      minifiedVersion: false,
    },
    {
      format: 'esm',
      generatedCode: 'es2015',
      extension: '.mjs',
      minifiedVersion: false,
    },
    {
      format: 'iife',
      generatedCode: 'es2015',
      extension: '.browser.es6.js',
      minifiedVersion: true,
      file: (originalPath) =>
        `${resolve(dirname(originalPath), 'browser', basename(originalPath))}`,
    },
    {
      format: 'iife',
      generatedCode: 'es5',
      extension: '.browser.es5.js',
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
      name: 'OverlayScrollbarsGlobal',
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
