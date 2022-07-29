const { dirname } = require('path');
const { rollup, watch: rollupWatch } = require('rollup');
const { test, expect } = require('@playwright/test');
const { collectCoverage, mergeCoverage } = require('./config/playwright/collectCoverage');

const playwrightRollup = async (testDir, watch = false) => {
  let server;
  const createPlaywrightRollupConfig = require(`${__dirname}/config/playwright/rollup.config.js`);
  const onListening = (srv) => {
    server = srv;
  };
  const config = await createPlaywrightRollupConfig(testDir, onListening);

  if (watch) {
    const watcher = rollupWatch(config);
    let outputPath = '';
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      watcher.on('event', ({ code, error, result, output }) => {
        if (code === 'ERROR') {
          console.log('Error:', error); // eslint-disable-line
        }
        if (code === 'BUNDLE_END') {
          outputPath = output[0];
          if (result && result.close) {
            result.close();
          }
        }
        if (code === 'END') {
          /*
          console.log('Watching for changes, press ENTER to continue.'); // eslint-disable-line
          console.log(''); // eslint-disable-line
          */
          resolve();
        }
      });
    });

    const { address, port } = server.address();
    return {
      url: `${address}:${port}`,
      output: outputPath,
      close: () => {
        server.close();
        watcher.close();
      },
    };
  }

  const bundle = await rollup(config);
  await bundle.write(config.output);
};

module.exports = {
  playwrightRollup: () => {
    const originalCwd = process.cwd();
    let url;
    let close;
    let output;

    // eslint-disable-next-line no-empty-pattern
    test.beforeAll(async ({}, { file }) => {
      ({ close, url, output } = await playwrightRollup(dirname(file), true));
    });

    test.beforeEach(async ({ page, browserName }) => {
      await page.goto(url);
      if (browserName === 'chromium') {
        await page.coverage.startJSCoverage();
      }
    });

    test.afterEach(async ({ page, browserName }, { file }) => {
      if (browserName === 'chromium') {
        const coverage = await page.coverage.stopJSCoverage();
        await collectCoverage(originalCwd, dirname(output), coverage, file);
      }
    });

    test.afterAll(() => {
      close();
    });
  },
  expectSuccess: async (page) => {
    await page.locator('#testResult').waitFor({ state: 'visible', timeout: 10 * 60 * 1000 }); // 10mins
    await expect(page.locator('#testResult')).toHaveClass('passed', { timeout: 500 });
  },
  mergeCoverage,
};
