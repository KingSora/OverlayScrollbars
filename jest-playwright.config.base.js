const path = require('path');

const deploymentConfig = path.resolve(__dirname, './config/jest-browser.rollup.config.js');
const testServerPath = path.resolve(__dirname, './config/jest-test-server.js');

module.exports = {
  browsers: ['chromium', 'firefox', 'webkit'],
  collectCoverage: true,
  launchType: 'LAUNCH',
  launchOptions: {
    headless: false,
  },
  serverOptions: {
    command: `node ${testServerPath}`,
    port: deploymentConfig.port,
    launchTimeout: 10000,
  },
};
