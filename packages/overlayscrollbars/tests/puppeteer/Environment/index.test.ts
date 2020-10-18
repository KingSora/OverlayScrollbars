import { Environment } from 'environment';
import url from './.build/build.html';

describe('Environment', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('should be titled "Environment"', async () => {
    //await expect(page).toMatchElement('#a');
    //await expect(page).toMatchElement('#b');
    //await expect(page).toMatchElement('#c');
    //await expect(page).toMatchElement('#d');

    const a: Environment = await page.evaluate(() => window.envInstance);
    console.log(a);
    await expect(page.title()).resolves.toMatch('Environment');
  });
});
