describe('usage on server', () => {
  test('import', async () => {
    await expect(
      (async () => {
        const module = await import('~/index');
        return module;
      })()
    ).resolves.toBeTruthy();
  });

  test('static functions', async () => {
    await expect(
      (async () => {
        const { OverlayScrollbars } = await import('~/index');

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
