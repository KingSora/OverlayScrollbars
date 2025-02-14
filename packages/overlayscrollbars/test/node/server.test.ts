import { describe, test, expect } from 'vitest';

describe('usage on server', () => {
  test('import', async () => {
    await expect(
      (async () => {
        const module = await import('../../src/index');
        return module;
      })()
    ).resolves.toBeTruthy();
  });

  test('static functions', async () => {
    await expect(
      (async () => {
        const { OverlayScrollbars } = await import('../../src/index');

        expect(() => {
          OverlayScrollbars.valid(false);
        }).not.toThrow();
        expect(() => {
          OverlayScrollbars.plugin({});
        }).not.toThrow();
      })()
    ).resolves.not.toThrow();
  });
});
