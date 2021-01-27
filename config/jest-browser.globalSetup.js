const { globalSetup } = require('jest-playwright-preset');

module.exports = async (jestConfig) => {
  await globalSetup(jestConfig);
};
