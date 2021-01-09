const path = require('path');

const deploymentConfig = path.resolve(__dirname, './config/jest-puppeteer.rollup.config.js');
const testServerPath = path.resolve(__dirname, './config/jest-test-server.js');

module.exports = {
  browser: 'chromium',
  browserContext: 'incognito',
  launch: {
    headless: false,
  },
  server: {
    command: `node ${testServerPath}`,
    port: deploymentConfig.port,
    launchTimeout: 10000,
  },
};
