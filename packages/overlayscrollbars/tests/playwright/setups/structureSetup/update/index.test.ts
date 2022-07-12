// @ts-ignore
import { playwrightRollup, expectSuccess } from '@/playwright/rollup';
import { test, Page } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.update', () => {
  [false].forEach(async (targetIsViewport) => {
    const isOrIsNot = targetIsViewport ? 'is' : 'is not';
    const setTargetIsVp = async (page: Page) => {
      if (targetIsViewport) {
        await page.click('#tvp');
        await page.waitForTimeout(500);
      }
    };

    test.describe(`target ${isOrIsNot} viewport`, () => {
      [false, true].forEach(async (nativeScrollbarStyling) => {
        const withText = nativeScrollbarStyling ? 'with' : 'without';
        const nss = async (page: Page) => {
          if (!nativeScrollbarStyling) {
            await page.click('#nss');
            await page.waitForTimeout(500);
          }
        };

        test.describe(`${withText} native scrollbar styling`, () => {
          test.describe.configure({ mode: 'parallel' });

          test('default', async ({ page }) => {
            await setTargetIsVp(page);
            await nss(page);
            await page.click('#start');
            await expectSuccess(page);
          });

          test('with fully overlaid scrollbars', async ({ page }) => {
            await setTargetIsVp(page);
            await nss(page);
            await page.click('#fo');
            await page.waitForTimeout(500);
            await page.click('#start');
            await expectSuccess(page);
          });

          test('with partially overlaid scrollbars', async ({ page, browserName }) => {
            test.skip(
              browserName === 'firefox' || browserName === 'webkit',
              "firefox can't simulate partially overlaid scrollbars, boost speed by omitting webkit"
            );

            await setTargetIsVp(page);
            await nss(page);
            await page.click('#po');
            await page.waitForTimeout(500);
            await page.click('#start');
            await expectSuccess(page);
          });

          test('without flexbox glue & css custom props', async ({ page }) => {
            await setTargetIsVp(page);
            await nss(page);
            await page.click('#fbg');
            await page.waitForTimeout(500);
            await page.click('#ccp');
            await page.waitForTimeout(500);
            await page.click('#start');
            await expectSuccess(page);
          });
        });
      });
    });
  });
});
