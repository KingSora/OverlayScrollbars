import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup({
  adaptUrl: (originalUrl) => {
    const url = new URL(originalUrl);
    url.hash = '#hi';
    return url.href;
  },
});

test.describe('StructureSetup.initScroll', () => {
  test('default', async ({ page }) => {
    await expectSuccess(page);
  });

  test('viewport with scrollable overflow', async ({ page }) => {
    await page.click('#vps');
    await expectSuccess(page);
  });

  test('viewport without scrollable overflow', async ({ page }) => {
    await page.click('#vp');
    await expectSuccess(page);
  });

  test('viewport is target', async ({ page }) => {
    await page.click('#vpt');
    await expectSuccess(page);
  });
});
