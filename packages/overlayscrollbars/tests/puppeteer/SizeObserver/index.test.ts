import expectPuppeteer from 'expect-puppeteer';
import url from './.build/build.html';

describe('Environment', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('test', async () => {
    await expectPuppeteer(page).toClick('#start');
    await expectPuppeteer(page).toMatchElement('#testResult.passed', {
      timeout: 30000,
    });
  }, 30000);
});
