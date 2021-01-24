import 'jest-playwright-preset';
import 'expect-playwright';
import url from './.build/build.html';

describe('SizeObserver', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  test('test', async () => {
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });
});
