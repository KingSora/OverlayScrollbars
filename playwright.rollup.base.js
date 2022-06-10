const { dirname } = require('path');
const { rollup, watch: rollupWatch } = require('rollup');
const { test, expect } = require('@playwright/test');

const playwrightRollup = async (testDir, watch = false) => {
  let server;
  const createPlaywrightRollupConfig = require(`${__dirname}/config/playwright/rollup.config.js`);
  const onListening = (srv) => {
    server = srv;
  };
  const config = await createPlaywrightRollupConfig(testDir, onListening);

  if (watch) {
    const watcher = rollupWatch(config);

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      watcher.on('event', ({ code, error, result }) => {
        if (code === 'ERROR') {
          console.log('Error:', error); // eslint-disable-line
        }
        if (code === 'BUNDLE_END') {
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
    let url;
    let close;

    // eslint-disable-next-line no-empty-pattern
    test.beforeAll(async ({}, { file }) => {
      ({ close, url } = await playwrightRollup(dirname(file), true));
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.afterAll(() => close());
  },
  expectSuccess: async (page) => {
    await page.locator('#testResult').waitFor({ state: 'visible', timeout: 10 * 60 * 1000 }); // 10mins
    await expect(page.locator('#testResult')).toHaveClass('passed', { timeout: 500 });
  },
};
