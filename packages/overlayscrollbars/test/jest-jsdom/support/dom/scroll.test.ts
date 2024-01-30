import {
  convertScrollPosition,
  getRawScrollBounds,
  scrollElementTo,
  getElmentScroll,
  getRawScrollRatio,
} from '~/support/dom/scroll';

describe('dom scroll', () => {
  describe('convertScrollPosition', () => {
    const overflowAmount = 100;

    test('normal environment', () => {
      expect(convertScrollPosition(0, overflowAmount)).toBe(0);
      expect(convertScrollPosition(50, overflowAmount)).toBe(50);
      expect(convertScrollPosition(100, overflowAmount)).toBe(100);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };

      /** normalized to raw */
      expect(convertScrollPosition(0, overflowAmount, rtlScrollBehavior)).toBe(100);
      expect(convertScrollPosition(50, overflowAmount, rtlScrollBehavior)).toBe(50);
      expect(convertScrollPosition(100, overflowAmount, rtlScrollBehavior)).toBe(0);

      /** raw to normalized */
      expect(convertScrollPosition(100, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(convertScrollPosition(50, overflowAmount, rtlScrollBehavior)).toBe(50);
      expect(convertScrollPosition(0, overflowAmount, rtlScrollBehavior)).toBe(100);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };

      /** normalized to raw */
      expect(convertScrollPosition(0, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(convertScrollPosition(50, overflowAmount, rtlScrollBehavior)).toBe(-50);
      expect(convertScrollPosition(100, overflowAmount, rtlScrollBehavior)).toBe(-100);

      /** raw to normalized */
      expect(convertScrollPosition(0, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(convertScrollPosition(-50, overflowAmount, rtlScrollBehavior)).toBe(50);
      expect(convertScrollPosition(-100, overflowAmount, rtlScrollBehavior)).toBe(100);
    });
  });

  describe('getRawScrollBounds', () => {
    test('normal environment', () => {
      expect(getRawScrollBounds(50)).toEqual([0, 50]);
      expect(getRawScrollBounds(100)).toEqual([0, 100]);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };
      expect(getRawScrollBounds(50, rtlScrollBehavior)).toEqual([50, 0]);
      expect(getRawScrollBounds(100, rtlScrollBehavior)).toEqual([100, 0]);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };
      expect(getRawScrollBounds(50, rtlScrollBehavior)).toEqual([0, -50]);
      expect(getRawScrollBounds(100, rtlScrollBehavior)).toEqual([0, -100]);
    });
  });

  describe('getRawScrollRatio', () => {
    const overflowAmount = 100;

    test('normal environment', () => {
      const [min, max] = getRawScrollBounds(overflowAmount);

      expect(getRawScrollRatio(min, overflowAmount)).toBe(0);
      expect(getRawScrollRatio(max, overflowAmount)).toBe(1);

      expect(getRawScrollRatio(30, overflowAmount)).toBe(0.3);
      expect(getRawScrollRatio(80, overflowAmount)).toBe(0.8);
      expect(getRawScrollRatio(-100, overflowAmount)).toBe(0);
      expect(getRawScrollRatio(0, overflowAmount)).toBe(0);
      expect(getRawScrollRatio(100, overflowAmount)).toBe(1);
      expect(getRawScrollRatio(200, overflowAmount)).toBe(1);

      // NaN = 0
      expect(getRawScrollRatio(0, 0)).toBe(0);
    });

    test('inverted environment', () => {
      const rtlScrollBehavior = { i: true, n: false };
      const [min, max] = getRawScrollBounds(overflowAmount, rtlScrollBehavior);

      expect(getRawScrollRatio(min, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(getRawScrollRatio(max, overflowAmount, rtlScrollBehavior)).toBe(1);

      expect(getRawScrollRatio(30, overflowAmount, rtlScrollBehavior)).toBe(0.7);
      expect(getRawScrollRatio(80, overflowAmount, rtlScrollBehavior)).toBe(0.2);
      expect(getRawScrollRatio(-100, overflowAmount, rtlScrollBehavior)).toBe(1);
      expect(getRawScrollRatio(0, overflowAmount, rtlScrollBehavior)).toBe(1);
      expect(getRawScrollRatio(100, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(getRawScrollRatio(200, overflowAmount, rtlScrollBehavior)).toBe(0);

      // NaN = 0
      expect(getRawScrollRatio(0, 0)).toBe(0);
    });

    test('negated environment', () => {
      const rtlScrollBehavior = { i: false, n: true };
      const [min, max] = getRawScrollBounds(overflowAmount, rtlScrollBehavior);

      expect(getRawScrollRatio(min, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(getRawScrollRatio(max, overflowAmount, rtlScrollBehavior)).toBe(1);

      expect(getRawScrollRatio(-30, overflowAmount, rtlScrollBehavior)).toBe(0.3);
      expect(getRawScrollRatio(-80, overflowAmount, rtlScrollBehavior)).toBe(0.8);
      expect(getRawScrollRatio(-200, overflowAmount, rtlScrollBehavior)).toBe(1);
      expect(getRawScrollRatio(-100, overflowAmount, rtlScrollBehavior)).toBe(1);
      expect(getRawScrollRatio(0, overflowAmount, rtlScrollBehavior)).toBe(0);
      expect(getRawScrollRatio(100, overflowAmount, rtlScrollBehavior)).toBe(0);

      // NaN = 0
      expect(getRawScrollRatio(0, 0)).toBe(0);
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
