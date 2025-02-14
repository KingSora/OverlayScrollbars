import { describe, test, beforeEach, expect } from 'vitest';
import {
  scrollElementTo,
  getElementScroll,
  sanitizeScrollCoordinates,
  isDefaultDirectionScrollCoordinates,
  getScrollCoordinatesPercent,
  getScrollCoordinatesPosition,
} from '../../../../src/support/dom/scroll';

describe('dom scroll', () => {
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

  describe('sanitizeScrollCoordinates', () => {
    test('everything is zero', () => {
      const { _start, _end } = sanitizeScrollCoordinates(
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
      const { _start, _end } = sanitizeScrollCoordinates(
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
      const positive = sanitizeScrollCoordinates(
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

      const negative = sanitizeScrollCoordinates(
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
      const positive = sanitizeScrollCoordinates(
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

      const negative = sanitizeScrollCoordinates(
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
      const { _start, _end } = sanitizeScrollCoordinates(
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
      const { _start, _end } = sanitizeScrollCoordinates(
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

    test('start equals end', () => {
      const { _start: startA, _end: endA } = sanitizeScrollCoordinates(
        {
          _start: { x: 999, y: 999 },
          _end: { x: 999, y: 999 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(startA).toEqual({ x: 0, y: 0 });
      expect(endA).toEqual({ x: 999, y: 999 });

      const { _start: startB, _end: endB } = sanitizeScrollCoordinates(
        {
          _start: { x: -999, y: -999 },
          _end: { x: -999, y: -999 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(startB).toEqual({ x: 0, y: 0 });
      expect(endB).toEqual({ x: -999, y: -999 });
    });

    test('start and end is not 0', () => {
      const { _start: startA, _end: endA } = sanitizeScrollCoordinates(
        {
          _start: { x: 200, y: -200 },
          _end: { x: 999, y: -999 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(startA).toEqual({ x: 0, y: 0 });
      expect(endA).toEqual({ x: 999, y: -999 });

      const { _start: startB, _end: endB } = sanitizeScrollCoordinates(
        {
          _start: { x: 999, y: -999 },
          _end: { x: 200, y: -200 },
        },
        {
          w: 999,
          h: 999,
        }
      );

      expect(startB).toEqual({ x: 999, y: -999 });
      expect(endB).toEqual({ x: 0, y: 0 });
    });

    test('closest axis coordinate is set to zero if start and end dont have zero', () => {
      const startGreater = sanitizeScrollCoordinates(
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

      const endGreater = sanitizeScrollCoordinates(
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

  test('isDefaultDirectionScrollCoordinates', () => {
    const zero = isDefaultDirectionScrollCoordinates({
      _start: { x: 0, y: 0 },
      _end: { x: 0, y: 0 },
    });
    expect(zero.x).toBe(true);
    expect(zero.y).toBe(true);

    const a = isDefaultDirectionScrollCoordinates({
      _start: { x: 0, y: 0 },
      _end: { x: 100, y: 100 },
    });
    expect(a.x).toBe(true);
    expect(a.y).toBe(true);

    const b = isDefaultDirectionScrollCoordinates({
      _start: { x: 0, y: 0 },
      _end: { x: -100, y: -100 },
    });
    expect(b.x).toBe(false);
    expect(b.y).toBe(false);

    const c = isDefaultDirectionScrollCoordinates({
      _start: { x: 100, y: 100 },
      _end: { x: 0, y: 0 },
    });
    expect(c.x).toBe(false);
    expect(c.y).toBe(false);

    const d = isDefaultDirectionScrollCoordinates({
      _start: { x: -100, y: -100 },
      _end: { x: 0, y: 0 },
    });
    expect(d.x).toBe(false);
    expect(d.y).toBe(false);
  });

  test('getScrollCoordinatesPercent', () => {
    const zero = getScrollCoordinatesPercent(
      {
        _start: { x: 0, y: 0 },
        _end: { x: 0, y: 0 },
      },
      {
        x: 0,
        y: 0,
      }
    );
    expect(zero.x).toBe(0);
    expect(zero.y).toBe(0);

    const a = getScrollCoordinatesPercent(
      {
        _start: { x: 0, y: 0 },
        _end: { x: 100, y: 100 },
      },
      {
        x: 30,
        y: 30,
      }
    );
    expect(a.x).toBe(0.3);
    expect(a.y).toBe(0.3);

    const b = getScrollCoordinatesPercent(
      {
        _start: { x: 0, y: 0 },
        _end: { x: -100, y: -100 },
      },
      {
        x: -30,
        y: -30,
      }
    );
    expect(b.x).toBe(0.3);
    expect(b.y).toBe(0.3);

    const c = getScrollCoordinatesPercent(
      {
        _start: { x: 100, y: 100 },
        _end: { x: 0, y: 0 },
      },
      {
        x: 70,
        y: 70,
      }
    );
    expect(c.x).toBe(0.3);
    expect(c.y).toBe(0.3);

    const d = getScrollCoordinatesPercent(
      {
        _start: { x: -100, y: -100 },
        _end: { x: 0, y: 0 },
      },
      {
        x: -70,
        y: -70,
      }
    );
    expect(d.x).toBe(0.3);
    expect(d.y).toBe(0.3);
  });

  test('getScrollCoordinatesPosition', () => {
    const zero = getScrollCoordinatesPosition(
      {
        _start: { x: 0, y: 0 },
        _end: { x: 0, y: 0 },
      },
      {
        x: 0,
        y: 0,
      }
    );
    expect(zero.x).toBe(0);
    expect(zero.y).toBe(0);

    const a = getScrollCoordinatesPosition(
      {
        _start: { x: 0, y: 0 },
        _end: { x: 100, y: 100 },
      },
      {
        x: 0.3,
        y: 0.3,
      }
    );
    expect(a.x).toBe(30);
    expect(a.y).toBe(30);

    const b = getScrollCoordinatesPosition(
      {
        _start: { x: 0, y: 0 },
        _end: { x: -100, y: -100 },
      },
      {
        x: 0.3,
        y: 0.3,
      }
    );
    expect(b.x).toBe(-30);
    expect(b.y).toBe(-30);

    const c = getScrollCoordinatesPosition(
      {
        _start: { x: 100, y: 100 },
        _end: { x: 0, y: 0 },
      },
      {
        x: 0.3,
        y: 0.3,
      }
    );
    expect(c.x).toBe(70);
    expect(c.y).toBe(70);

    const d = getScrollCoordinatesPosition(
      {
        _start: { x: -100, y: -100 },
        _end: { x: 0, y: 0 },
      },
      {
        x: 0.3,
        y: 0.3,
      }
    );
    expect(d.x).toBe(-70);
    expect(d.y).toBe(-70);
  });
});
