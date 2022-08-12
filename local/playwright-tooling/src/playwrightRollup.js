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
        bundleOutput = output;
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
    url: `${address}:${port}`,
    output: outputPath,
    close: () => {
      getServer().close();
      watcher.close();
    },
  };
};

module.exports = (useEsbuild = true) => {
  const originalCwd = process.cwd();
  let url;
  let close;
  let output;

  // eslint-disable-next-line no-empty-pattern
  test.beforeAll(async ({}, { file, config, timeout }) => {
    const isDev = config.globalTimeout === 0 && timeout === 0 && config.workers === 1;

    if (isDev) {
      test.setTimeout(0);
    }

    ({ close, url, output } = await createRollupBundle(dirname(file), useEsbuild, isDev));
  });

  test.beforeEach(async ({ page, browserName }, { config }) => {
    await page.goto(url);
    if (browserName === 'chromium' && config.quiet) {
      await page.coverage.startJSCoverage();
    }
  });

  test.afterEach(async ({ page, browserName }, { file, config }) => {
    if (browserName === 'chromium' && config.quiet) {
      const coverage = await page.coverage.stopJSCoverage();
      await collectCoverage(originalCwd, dirname(output), coverage, file);
    }
  });

  test.afterAll(() => {
    close();
  });
};
