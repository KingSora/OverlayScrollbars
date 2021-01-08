const PuppeteerEnvironment = require('jest-environment-puppeteer');
// const pti = require('puppeteer-to-istanbul');
const { setupRollupTest, cleanupRollupTest } = require('./jest-puppeteer.rollup.js');

class PuppeteerRollupEnvironment extends PuppeteerEnvironment {
  constructor(envConfig, envContext) {
    super(envConfig, envContext);

    this.watch = envConfig.displayName.name === 'puppeteer-dev';
    this.ctx = envContext;
    this.cfg = envConfig;
  }

  async setup() {
    // setup
    await setupRollupTest(this.cfg.rootDir, this.ctx.testPath, this.cfg.cache && this.cfg.cacheDirectory, this.watch);
    await super.setup();

    // coverage
    // const { page } = this.global;
    // await Promise.all([page.coverage.startCSSCoverage(), page.coverage.startJSCoverage()]);
  }

  async teardown() {
    // coverage
    // const { page } = this.global;
    // const [jsCoverage, cssCoverage] = await Promise.all([page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage()]);
    // pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true, storagePath: './.pptr' });

    // cleanup
    cleanupRollupTest(this.ctx.testPath, this.cfg.cache);
    await super.teardown();
  }
}

module.exports = PuppeteerRollupEnvironment;
