import { getScrollbarHandleOffsetPercent } from '~/setups/scrollbarsSetup/scrollbarsSetup.calculations';

describe('scrollbarsSetup.calculations', () => {
  describe('getScrollbarHandleOffsetPercent', () => {
    test('normal environment', () => {
      expect(getScrollbarHandleOffsetPercent(30, 100)).toBe(0.3);
      expect(getScrollbarHandleOffsetPercent(80, 100)).toBe(0.8);
      expect(getScrollbarHandleOffsetPercent(-100, 100)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(0, 100)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(100, 100)).toBe(1);
      expect(getScrollbarHandleOffsetPercent(200, 100)).toBe(1);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };
      expect(getScrollbarHandleOffsetPercent(30, 100, rtlScrollBehavior)).toBe(0.3);
      expect(getScrollbarHandleOffsetPercent(80, 100, rtlScrollBehavior)).toBe(0.8);
      expect(getScrollbarHandleOffsetPercent(-100, 100, rtlScrollBehavior)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(0, 100, rtlScrollBehavior)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(100, 100, rtlScrollBehavior)).toBe(1);
      expect(getScrollbarHandleOffsetPercent(200, 100, rtlScrollBehavior)).toBe(1);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };
      expect(getScrollbarHandleOffsetPercent(-30, 100, rtlScrollBehavior)).toBe(0.7);
      expect(getScrollbarHandleOffsetPercent(-80, 100, rtlScrollBehavior)).toBe(0.2);
      expect(getScrollbarHandleOffsetPercent(-200, 100, rtlScrollBehavior)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(-100, 100, rtlScrollBehavior)).toBe(0);
      expect(getScrollbarHandleOffsetPercent(0, 100, rtlScrollBehavior)).toBe(1);
      expect(getScrollbarHandleOffsetPercent(100, 100, rtlScrollBehavior)).toBe(1);
    });
  });
});
