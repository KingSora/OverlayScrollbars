const PuppeteerRollupEnvironment = require('./jest-puppeteer.env.rollup.js');

class CustomEnvironment extends PuppeteerRollupEnvironment {
  async setup() {
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
