import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test, Page } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.update', () => {
  [false].forEach((targetIsViewport) => {
    const isOrIsNot = targetIsViewport ? 'is' : 'is not';
    const setTargetIsVp = async (page: Page) => {
      if (targetIsViewport) {
        await page.click('#tvp');
      }
    };

    test.describe(`target ${isOrIsNot} viewport`, () => {
      [false, true].forEach((nativeScrollbarStyling) => {
        const withText = nativeScrollbarStyling ? 'with' : 'without';
        const nsh = async (page: Page) => {
          if (!nativeScrollbarStyling) {
            await page.click('#nsh');
          }
        };

        test.describe(`${withText} native scrollbar styling`, () => {
          test.describe.configure({ mode: 'parallel' });

          test('default', async ({ page }) => {
            await setTargetIsVp(page);
            await nsh(page);

            await expectSuccess(page);
          });

          test('with fully overlaid scrollbars', async ({ page }) => {
            await setTargetIsVp(page);
            await nsh(page);

            await page.click('#fo');

            await expectSuccess(page);
          });

          test('with partially overlaid scrollbars', async ({ page, browserName }) => {
            test.skip(
              browserName === 'firefox' || browserName === 'webkit',
              "firefox can't simulate partially overlaid scrollbars, boost speed by omitting webkit"
            );

            await setTargetIsVp(page);
            await nsh(page);

            await page.click('#po');

            await expectSuccess(page);
          });

          test('without flexbox glue & css custom props', async ({ page }) => {
            await setTargetIsVp(page);
            await nsh(page);

            await page.click('#fbg');
            await page.click('#ccp');

            await expectSuccess(page);
          });
        });
      });
    });
  });
});
