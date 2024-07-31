import { dirname, basename, resolve } from 'node:path';
import rollupTerser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import createRollupConfig from '@~local/rollup';
import pkg from './package.json' with { type: 'json' };

const { devDependencies, peerDependencies, version } = pkg;

export default createRollupConfig({
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
            import: {
              types: './types/overlayscrollbars.d.mts',
              default: './overlayscrollbars.mjs',
            },
            require: {
              types: './types/overlayscrollbars.d.cts',
              default: './overlayscrollbars.cjs',
            },
            default: {
              types: './types/overlayscrollbars.d.ts',
              default: './overlayscrollbars.cjs.js',
            },
          },
          './package.json': './package.json',
          './overlayscrollbars.css': './styles/overlayscrollbars.css',
          './styles/overlayscrollbars.css': './styles/overlayscrollbars.css',
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
    plugins: [filesize()],
    treeshake: {
      propertyReadSideEffects: false,
      moduleSideEffects: false,
      annotations: false,
    },
  },
});
