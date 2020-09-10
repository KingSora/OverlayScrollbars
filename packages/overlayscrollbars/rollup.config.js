const base = require('../../rollup.config.base');

const config = {
  name: 'OverlayScrollbars',
  exports: 'auto',
  globals: {
    jquery: 'jQuery',
  },
};

module.exports = (_, ...args) => base(config, ...args);
