const { dirname } = require('path');
const { watch: rollupWatch } = require('rollup');
const { test } = require('@playwright/test');
const createPlaywrightRollupConfig = require('@~local/rollup/playwright');
const collectCoverage = require('./collectCoverage');

const createRollupBundle = async (testDir, useEsbuild, dev) => {
  const [config, getServer] = await createPlaywrightRollupConfig(testDir, useEsbuild, dev);
  const watcher = rollupWatch(config);

  const outputPath = await new Promise((resolve) => {
    let bundleOutput;
    if (dev) {
      console.log(`Using: ${useEsbuild ? 'esbuild' : 'rollup'}`); // eslint-disable-line
    }
    watcher.on('event', (event) => {
      const { code, error, result, output } = event;
      if (code === 'ERROR') {
        console.log('Error:', error); // eslint-disable-line
      }
      if (code === 'START') {
        if (dev) {
          // eslint-disable-next-line
          console.log(`Building...`);
        }
      }
      if (code === 'BUNDLE_END') {
        bundleOutput = output[0];
        if (result) {
          result.close();
        }
      }
      if (code === 'END') {
        if (dev) {
          // eslint-disable-next-line
          console.log(`Watching for changes...`);
          console.log(''); // eslint-disable-line
        } else {
          resolve(bundleOutput);
        }
      }
    });
  });

  const { address, port } = getServer().address();
  return {
    url: `http://${address}:${port}`,
    output: outputPath,
    close: () => {
      getServer().close();
      watcher.close();
    },
  };
};

module.exports = (options) => {
  const { useEsbuild = true, adaptUrl = (originalUrl) => originalUrl } = options || {};
  let url;
  let close;

  const isDev = (config, timeout) =>
    config.globalTimeout === 0 && timeout === 0 && config.workers === 1;

  // eslint-disable-next-line no-empty-pattern
  test.beforeAll(async ({}, { file, config, timeout }) => {
    if (isDev(config, timeout)) {
      test.setTimeout(0);
    }

    ({ close, url } = await createRollupBundle(dirname(file), useEsbuild, isDev(config, timeout)));
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(adaptUrl(url), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);
  });

  test.afterEach(async ({ page, browserName }, { file, config, timeout }) => {
    if (browserName === 'chromium' && !isDev(config, timeout)) {
      const coverageJSON = await page
        .evaluate(() => JSON.stringify(window.__coverage__))
        .catch(() => null);
      await collectCoverage(process.cwd(), coverageJSON, file);
    }
  });

  test.afterAll(() => {
    close();
  });
};
