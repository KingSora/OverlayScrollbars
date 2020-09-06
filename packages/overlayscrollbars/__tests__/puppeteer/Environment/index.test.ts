import url from './__build__/build.html';

describe('Environment', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('should be titled "Environment"', async () => {
    await expect(page).toMatchElement('#a');
    await expect(page).toMatchElement('#b');
    await expect(page).toMatchElement('#c');
    await expect(page).toMatchElement('#d');
    await expect(page.title()).resolves.toMatch('Environment');
  });
});
