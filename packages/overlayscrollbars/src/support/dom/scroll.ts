import type { XY } from './offset';
import type { WH } from './dimensions';
import { capNumber, isNumber, mathAbs, mathSign } from '../utils';

export interface ScrollCoordinates {
  /** The start (origin) scroll coordinates for each axis. */
  _start: XY<number>;
  /** The end scroll coordinates for each axis. */
  _end: XY<number>;
}

/**
 * Scroll the passed element to the passed position.
 * @param elm The element to be scrolled.
 * @param position The scroll position.
 */
export const scrollElementTo = (
  elm: HTMLElement,
  position: Partial<XY<number | false | null | undefined>> | number | false | null | undefined
): void => {
  const { x, y } = isNumber(position) ? { x: position, y: position } : position || {};
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isNumber(x) && (elm.scrollLeft = x);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isNumber(y) && (elm.scrollTop = y);
};

/**
 * Scroll the passed element to the passed position.
 * @param elm The element to be scrolled.
 * @param position The scroll position.
 */
export const getElementScroll = (elm: HTMLElement): Readonly<XY> => ({
  x: elm.scrollLeft,
  y: elm.scrollTop,
});

/**
 * Scroll Coordinates which are 0.
 */
export const getZeroScrollCoordinates = (): ScrollCoordinates => ({
  _start: { x: 0, y: 0 },
  _end: { x: 0, y: 0 },
});

/**
 * Sanatizes raw scroll coordinates.
 * The passed `overflowAmount` is used as the "max" value for each axis if the sign of the raw max value is not `0`.
 * Makes sure that each axis has `0` either in the start or end coordinates.
 * @param rawScrollCoordinates The raw scroll coordinates.
 * @param overflowAmount The overflow amount.
 * @returns
 */
export const sanitizeScrollCoordinates = (
  rawScrollCoordinates: ScrollCoordinates,
  overflowAmount: WH<number>
) => {
  const { _start, _end } = rawScrollCoordinates;
  const { w, h } = overflowAmount;
  const sanitizeAxis = (start: number, end: number, amount: number) => {
    let newStart = mathSign(start) * amount;
    let newEnd = mathSign(end) * amount;

    if (newStart === newEnd) {
      const startAbs = mathAbs(start);
      const endAbs = mathAbs(end);

      newEnd = startAbs > endAbs ? 0 : newEnd;
      newStart = startAbs < endAbs ? 0 : newStart;
    }

    // in doubt set start to 0
    newStart = newStart === newEnd ? 0 : newStart;

    return [newStart + 0, newEnd + 0] as const; // "+ 0" prevents "-0" to be in the result
  };

  const [startX, endX] = sanitizeAxis(_start.x, _end.x, w);
  const [startY, endY] = sanitizeAxis(_start.y, _end.y, h);

  return {
    _start: {
      x: startX,
      y: startY,
    },
    _end: {
      x: endX,
      y: endY,
    },
  };
};

/**
 * Returns whether the passed scroll coordinates represent the browsers default scroll direction.
 * For the default scroll direction the following must be true:
 * 1. Start value is `0`.
 * 2. End value <= Start value.
 * @param scrollCoordinates The scroll coordinates.
 */
export const isDefaultDirectionScrollCoordinates = ({
  _start,
  _end,
}: ScrollCoordinates): XY<boolean> => {
  const getAxis = (start: number, end: number) => start === 0 && start <= end;

  return {
    x: getAxis(_start.x, _end.x),
    y: getAxis(_start.y, _end.y),
  };
};

/**
 * Gets the current scroll percent between 0..1 for each axis.
 * @param scrollCoordinates The scroll coordinates.
 * @param currentScroll The current scroll position of the element.
 */
export const getScrollCoordinatesPercent = (
  { _start, _end }: ScrollCoordinates,
  currentScroll: XY<number>
) => {
  const getAxis = (start: number, end: number, current: number) =>
    capNumber(0, 1, (start - current) / (start - end) || 0);

  return {
    x: getAxis(_start.x, _end.x, currentScroll.x),
    y: getAxis(_start.y, _end.y, currentScroll.y),
  };
};

/**
 * Gets the scroll position of the given percent.
 * @param scrollCoordinates The scroll coordinates.
 * @param percent The percentage of the scroll.
 */
export const getScrollCoordinatesPosition = (
  { _start, _end }: ScrollCoordinates,
  percent: XY<number>
) => {
  const getAxis = (start: number, end: number, p: number) => start + (end - start) * p;

  return {
    x: getAxis(_start.x, _end.x, percent.x),
    y: getAxis(_start.y, _end.y, percent.y),
  };
};
