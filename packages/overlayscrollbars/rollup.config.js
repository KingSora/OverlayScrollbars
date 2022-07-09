const createRollupConfig = require('../../rollup.config.base');
const { devDependencies, peerDependencies } = require('./package.json');

module.exports = createRollupConfig({
  project: 'OverlayScrollbars',
  extractStyle: true,
  rollup: {
    external: Object.keys(devDependencies || {}).concat(Object.keys(peerDependencies || {})),
    output: {
      exports: 'auto',
    },
  },
});
