const path = require('path');

const { TEST_SERVER_PORT } = process.env;
const port = TEST_SERVER_PORT ? Number(TEST_SERVER_PORT) : 8080;
const testServerPath = path.resolve(__dirname, './config/jest-test-server.js');

process.env.TEST_SERVER_PORT = port;

module.exports = {
  browser: 'chromium',
  browserContext: 'incognito',
  launch: {
    headless: false,
  },
  server: {
    command: `cross-env TEST_SERVER_PORT=${port} node ${testServerPath}`,
    port,
    launchTimeout: 4000,
  },
};
