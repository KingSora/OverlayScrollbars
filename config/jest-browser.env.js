const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default;
const { setupRollupTest, cleanupRollupTest } = require('./jest-browser.rollup.js');

const buildTests = [];

class BrowserRollupEnvironment extends PlaywrightEnvironment {
  constructor(envConfig, envContext) {
    super(envConfig, envContext);

    this.watch = (envConfig.displayName.name || '').includes('-dev');
    this.ctx = envContext;
    this.cfg = envConfig;
  }

  async setup() {
    const { testPath } = this.ctx;

    if (!buildTests.includes(testPath)) {
      await cleanupRollupTest(testPath, this.cfg.cache);
      await setupRollupTest(this.cfg.rootDir, this.ctx.testPath, this.cfg.cache && this.cfg.cacheDirectory, this.watch);
      buildTests.push(testPath);
    }

    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = BrowserRollupEnvironment;
