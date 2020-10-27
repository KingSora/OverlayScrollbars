import { Environment } from 'environment';
import url from './.build/build.html';

describe('Environment', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('should be titled "Environment"', async () => {
    const a: Environment = await page.evaluate(() => window.envInstance);
    console.log(a);
    await expect(page.title()).resolves.toMatch('Environment');
  });
});
