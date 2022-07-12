const { terser: rollupTerser } = require('rollup-plugin-terser');
const createRollupConfig = require('../../rollup.config.base');
const { devDependencies, peerDependencies } = require('./package.json');

module.exports = createRollupConfig({
  project: 'OverlayScrollbars',
  extractStyle: true,
  rollup: {
    external: Object.keys(devDependencies || {}).concat(Object.keys(peerDependencies || {})),
    output: {
      exports: 'auto',
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
          },
        }),
      ],
    },
  },
});
