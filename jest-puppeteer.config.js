const { TEST_SERVER_PORT } = process.env;
const port = TEST_SERVER_PORT ? Number(TEST_SERVER_PORT) : 8080;

process.env.TEST_SERVER_PORT = port;

module.exports = {
  browser: 'chromium',
  browserContext: 'incognito',
  server: {
    command: `cross-env TEST_SERVER_PORT=${port} node jest-test-server`,
    port,
    launchTimeout: 4000,
  },
};
