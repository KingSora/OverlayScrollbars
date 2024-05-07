import {
  convertScrollPosition,
  scrollElementTo,
  getElementScroll,
  sanatizeScrollCoordinates,
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

  describe('getElementScroll', () => {
    beforeEach(() => {
      document.body.scrollLeft = 0;
      document.body.scrollTop = 0;
    });

    test('x', () => {
      scrollElementTo(document.body, {
        x: 222,
      });

      expect(getElementScroll(document.body)).toEqual({ x: 222, y: 0 });
    });

    test('y', () => {
      scrollElementTo(document.body, {
        y: 333,
      });

      expect(getElementScroll(document.body)).toEqual({ x: 0, y: 333 });
    });

    test('xy', () => {
      scrollElementTo(document.body, {
        x: 222,
        y: 333,
      });

      expect(getElementScroll(document.body)).toEqual({ x: 222, y: 333 });
    });
  });

  describe('sanatizeScrollCoordinates', () => {
    test('everything is zero', () => {
      const { _start, _end } = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: 0 },
          _end: { x: 0, y: 0 },
        },
        {
          w: 0,
          h: 0,
        }
      );

      expect(_start).toEqual({ x: 0, y: 0 });
      expect(_end).toEqual({ x: 0, y: 0 });
    });

    test('overflow amount is zero', () => {
      const { _start, _end } = sanatizeScrollCoordinates(
        {
          _start: { x: -123, y: 531 },
          _end: { x: 23, y: -11 },
        },
        {
          w: 0,
          h: 0,
        }
      );

      expect(_start).toEqual({ x: 0, y: 0 });
      expect(_end).toEqual({ x: 0, y: 0 });
    });

    test('overflow amount is smaller than scroll coordinate', () => {
      const positive = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: 200 },
          _end: { x: 200, y: 0 },
        },
        {
          w: 100,
          h: 100,
        }
      );

      expect(positive._start).toEqual({ x: 0, y: 100 });
      expect(positive._end).toEqual({ x: 100, y: 0 });

      const negative = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: -200 },
          _end: { x: -200, y: 0 },
        },
        {
          w: 100,
          h: 100,
        }
      );

      expect(negative._start).toEqual({ x: 0, y: -100 });
      expect(negative._end).toEqual({ x: -100, y: 0 });
    });

    test('overflow amount is greater than scroll coordinate', () => {
      const positive = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: 100 },
          _end: { x: 100, y: 0 },
        },
        {
          w: 200,
          h: 200,
        }
      );

      expect(positive._start).toEqual({ x: 0, y: 200 });
      expect(positive._end).toEqual({ x: 200, y: 0 });

      const negative = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: -100 },
          _end: { x: -100, y: 0 },
        },
        {
          w: 200,
          h: 200,
        }
      );

      expect(negative._start).toEqual({ x: 0, y: -200 });
      expect(negative._end).toEqual({ x: -200, y: 0 });
    });

    test('start is smaller than end', () => {
      const { _start, _end } = sanatizeScrollCoordinates(
        {
          _start: { x: 0, y: 0 },
          _end: { x: 999, y: -999 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(_start).toEqual({ x: 0, y: 0 });
      expect(_end).toEqual({ x: 999, y: -999 });
    });

    test('start is greater than end', () => {
      const { _start, _end } = sanatizeScrollCoordinates(
        {
          _start: { x: 999, y: -999 },
          _end: { x: 0, y: 0 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(_start).toEqual({ x: 999, y: -999 });
      expect(_end).toEqual({ x: 0, y: 0 });
    });

    test('closest axis coordinate is set to zero if start and end dont have zero', () => {
      const startGreater = sanatizeScrollCoordinates(
        {
          _start: { x: 999, y: -999 },
          _end: { x: 555, y: -555 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(startGreater._start).toEqual({ x: 999, y: -999 });
      expect(startGreater._end).toEqual({ x: 0, y: 0 });

      const endGreater = sanatizeScrollCoordinates(
        {
          _start: { x: -555, y: 555 },
          _end: { x: -999, y: 999 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(endGreater._start).toEqual({ x: 0, y: 0 });
      expect(endGreater._end).toEqual({ x: -999, y: 999 });
    });
  });
});
