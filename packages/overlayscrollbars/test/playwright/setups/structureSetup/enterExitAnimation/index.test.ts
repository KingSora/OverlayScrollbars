import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

// required for test with a separate "app"
test.describe.configure({ mode: 'serial' });

test.describe('StructureSetup.body', () => {
  test('enter & exit animations run without flowDirection detection on overflow without ndsd', async ({
    page,
  }) => {
    await expectSuccess(page);
  });

  test('enter & exit animations run without flowDirection detection on overflow with ndsd', async ({
    page,
  }) => {
    await page.click('#ndsd');
    await expectSuccess(page);
  });

  test('enter & exit animations run without flowDirection detection on overflow with ndsd and ifd', async ({
    page,
  }) => {
    await page.click('#ndsd');
    await page.click('#ifd');
    await expectSuccess(page);
  });
});
