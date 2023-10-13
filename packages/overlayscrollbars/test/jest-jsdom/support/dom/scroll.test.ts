import {
  getRTLCompatibleScrollPosition,
  getRTLCompatibleScrollBounds,
  scrollElementTo,
  getElmentScroll,
} from '~/support/dom/scroll';

describe('dom scroll', () => {
  describe('getRTLCompatibleScrollPosition', () => {
    test('normal environment', () => {
      expect(getRTLCompatibleScrollPosition(0, 100)).toBe(0);
      expect(getRTLCompatibleScrollPosition(50, 100)).toBe(50);
      expect(getRTLCompatibleScrollPosition(100, 100)).toBe(100);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };
      expect(getRTLCompatibleScrollPosition(0, 100, rtlScrollBehavior)).toBe(100);
      expect(getRTLCompatibleScrollPosition(50, 100, rtlScrollBehavior)).toBe(50);
      expect(getRTLCompatibleScrollPosition(100, 100, rtlScrollBehavior)).toBe(0);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };
      expect(getRTLCompatibleScrollPosition(0, 100, rtlScrollBehavior)).toBe(-0);
      expect(getRTLCompatibleScrollPosition(50, 100, rtlScrollBehavior)).toBe(-50);
      expect(getRTLCompatibleScrollPosition(100, 100, rtlScrollBehavior)).toBe(-100);
    });
  });

  describe('getRTLCompatibleScrollBounds', () => {
    test('normal environment', () => {
      expect(getRTLCompatibleScrollBounds(50)).toEqual([0, 50]);
      expect(getRTLCompatibleScrollBounds(100)).toEqual([0, 100]);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };
      expect(getRTLCompatibleScrollBounds(50, rtlScrollBehavior)).toEqual([50, 0]);
      expect(getRTLCompatibleScrollBounds(100, rtlScrollBehavior)).toEqual([100, 0]);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };
      expect(getRTLCompatibleScrollBounds(50, rtlScrollBehavior)).toEqual([0, -50]);
      expect(getRTLCompatibleScrollBounds(100, rtlScrollBehavior)).toEqual([0, -100]);
    });
  });

  describe('scrollElementTo', () => {
    beforeEach(() => {
      document.body.scrollLeft = 0;
      document.body.scrollTop = 0;
    });

    test('x', () => {
      scrollElementTo(document.body, {
        x: 222,
      });

      expect(document.body.scrollLeft).toBe(222);
      expect(document.body.scrollTop).toBe(0);
    });

    test('y', () => {
      scrollElementTo(document.body, {
        y: 333,
      });

      expect(document.body.scrollLeft).toBe(0);
      expect(document.body.scrollTop).toBe(333);
    });

    test('xy', () => {
      scrollElementTo(document.body, {
        x: 222,
        y: 333,
      });

      expect(document.body.scrollLeft).toBe(222);
      expect(document.body.scrollTop).toBe(333);
    });
  });

  describe('getElmentScroll', () => {
    beforeEach(() => {
      document.body.scrollLeft = 0;
      document.body.scrollTop = 0;
    });

    test('x', () => {
      scrollElementTo(document.body, {
        x: 222,
      });

      expect(getElmentScroll(document.body)).toEqual({ x: 222, y: 0 });
    });

    test('y', () => {
      scrollElementTo(document.body, {
        y: 333,
      });

      expect(getElmentScroll(document.body)).toEqual({ x: 0, y: 333 });
    });

    test('xy', () => {
      scrollElementTo(document.body, {
        x: 222,
        y: 333,
      });

      expect(getElmentScroll(document.body)).toEqual({ x: 222, y: 333 });
    });
  });
});
