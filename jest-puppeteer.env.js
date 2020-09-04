const path = require('path');
const del = require('del');
const rollup = require('rollup');
const babel = require('@babel/core');
const PuppeteerEnvironment = require('jest-environment-puppeteer');
const resolve = require('./resolve.config.json');

const rollupInputFile = 'index';
const rollupOutputFile = 'index';
const rollupOutputDir = 'build';
const rollupNodeEnv = 'build';

const getRollupInfos = (testPath) => {
  const projectRootPath = path.resolve(__dirname, resolve.projectRoot);
  const testDir = path.dirname(testPath);
  const input = path.resolve(testDir, rollupInputFile);
  const dist = path.resolve(testDir, rollupOutputDir);
  const file = rollupOutputFile;

  return {
    projectRootPath,
    input,
    dist,
    file,
  };
};

const rollupTest = async (testPath) => {
  const { projectRootPath, input, dist, file } = getRollupInfos(testPath);
  const testPathSplit = path.relative(projectRootPath, testPath).split(path.sep);

  if (testPathSplit.length > 0) {
    const env = process.env.NODE_ENV;

    const project = testPathSplit[0];
    const { code: rollupConfigCode } = await babel.transformFileSync('./rollup.config.js', {});

    process.env.NODE_ENV = rollupNodeEnv;
    // eslint-disable-next-line no-eval
    let rollupConfig = await eval(rollupConfigCode)(
      { 'config-project': project },
      {
        input,
        dist,
        file,
        types: null,
        minVersions: false,
        esmBuild: false,
        sourcemap: false,
      },
      true
    );
    if (!Array.isArray(rollupConfig)) {
      rollupConfig = [rollupConfig];
    }

    for (let i = 0; i < rollupConfig.length; i++) {
      const inputConfig = rollupConfig[i];
      let { output } = inputConfig;
      // eslint-disable-next-line no-await-in-loop
      const bundle = await rollup.rollup(inputConfig);

      if (!Array.isArray(output)) {
        output = [output];
      }

      for (let v = 0; v < output.length; v++) {
        const outputConfig = output[i];
        // eslint-disable-next-line no-await-in-loop
        await bundle.write(outputConfig);
      }
    }

    process.env.NODE_ENV = env;
  }
};

const cleanRollupTest = async (testPath) => {
  const { dist } = getRollupInfos(testPath);
  await del(dist);
};

class CustomEnvironment extends PuppeteerEnvironment {
  constructor(config, context) {
    super(config, context);

    this.ctx = context;
  }

  async setup() {
    await rollupTest(this.ctx.testPath);
    await super.setup();
  }

  async teardown() {
    await cleanRollupTest(this.ctx.testPath);
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
