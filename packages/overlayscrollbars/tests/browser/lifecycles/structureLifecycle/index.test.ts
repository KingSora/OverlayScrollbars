import 'jest-playwright-preset';
import 'expect-playwright';
import url from './.build/build.html';

describe('StructureLifecycle', () => {
  beforeEach(async () => {
    await jestPlaywright.resetPage();
    await page.goto(url);
  });

  [false, true].forEach(async (nativeScrollbarStyling) => {
    const withText = nativeScrollbarStyling ? 'with' : 'without';
    const nss = async () => {
      if (!nativeScrollbarStyling) {
        await page.click('#nss');
        await page.waitForTimeout(500);
      }
    };

    describe(`structureLifecycles ${withText} native scrollbar styling`, () => {
      test('default', async () => {
        await nss();
        await page.click('#start');
        await expect(page).toHaveSelector('#testResult.passed');
      });

      test('without flexbox glue & css custom props', async () => {
        await nss();
        await page.click('#fbg');
        await page.waitForTimeout(500);
        await page.click('#ccp');
        await page.waitForTimeout(500);
        await page.click('#start');
        await expect(page).toHaveSelector('#testResult.passed');
      });

      // firefox can't simulate partially overlaid scrollbars, boost speed by omitting webkit
      test.jestPlaywrightSkip({ browsers: ['firefox', 'webkit'] }, 'with partially overlaid scrollbars', async () => {
        await nss();
        await page.click('#po');
        await page.waitForTimeout(500);
        await page.click('#start');
        await expect(page).toHaveSelector('#testResult.passed');
      });

      test('with fully overlaid scrollbars', async () => {
        await nss();
        await page.click('#fo');
        await page.waitForTimeout(500);
        await page.click('#start');
        await expect(page).toHaveSelector('#testResult.passed');
      });
    });
  });
});
