import expectPuppeteer from 'expect-puppeteer';
import url from './.build/build.html';

describe('SizeObserver', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  test('test', async () => {
    await expectPuppeteer(page).toClick('#start');
    await expectPuppeteer(page).toMatchElement('#testResult.passed');
  });
});