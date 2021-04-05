import 'jest-playwright-preset';
import 'expect-playwright';
import { Environment } from 'environment';
import url from './.build/build.html';

/**
 * env test cases:
 * 1. overlaid scrollbars
 *    - with scrollbar styling
 *    - without scrollbar styling
 *      - with css custom properties
 *      - without css custom properties
 * 2. partially overlaid, partially normal scrollbars
 *    - with scrollbar styling
 *    - without scrollbar styling
 *      - with css custom properties
 *      - without css custom properties
 * 3. normal scrollbars
 *    - with scrollbar styling
 *    - without scrollbar styling
 */

describe('StructureLifecycle', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  test('page should be titled "Environment"', async () => {
    // @ts-ignore
    const a: Environment = await page.evaluate(() => window.structureLifecycle.envInstance);
    console.log(a);
    await expect(page.title()).resolves.toMatch('structureLifecycle');
  });
});
