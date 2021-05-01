import 'jest-playwright-preset';
import 'expect-playwright';
import url from './.build/build.html';

describe('DOMObserver', () => {
  beforeEach(async () => {
    await jestPlaywright.resetPage();
    await page.goto(url);
  });

  test('test', async () => {
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });
});
