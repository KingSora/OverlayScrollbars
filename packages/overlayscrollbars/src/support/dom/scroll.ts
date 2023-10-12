import type { Environment } from '~/environment';
import type { XY } from './offset';
import { isNumber } from '../utils';

/**
 * Transforms a normalized (>= 0) scroll position to a RTL compatilbe scroll position value.
 * @param normalizedScrollPosition The normalized scroll position value.
 * @param rtlScrollBehavior The RTL scroll behavior or `false` / `undefined` if the rtl scroll behavior doesn't apply.
 * @returns The input scroll position but transformed to a RTL compatible format.
 */
export const getRTLCompatibleScrollPosition = (
  normalizedScrollPosition: number,
  normalizedScrollPositionMax: number,
  rtlScrollBehavior?: Environment['rtlScrollBehavior'] | false
) =>
  rtlScrollBehavior
    ? rtlScrollBehavior.n
      ? -normalizedScrollPosition
      : rtlScrollBehavior.i
      ? normalizedScrollPositionMax - normalizedScrollPosition
      : normalizedScrollPosition
    : normalizedScrollPosition;

/**
 * Gets the RTL compatilbe scroll boundaries from the normalized (>= 0) max scroll position.
 * @param normalizedScrollPositionMax The normalzed max scroll position value.
 * @param rtlScrollBehavior The RTL scroll behavior or `false` / `undefined` if the rtl scroll behavior doesn't apply.
 * @returns RTL compatible scroll boundaries. (min will scroll to start and max will scroll to end)
 */
export const getRTLCompatibleScrollBounds = (
  normalizedScrollPositionMax: number,
  rtlScrollBehavior?: Environment['rtlScrollBehavior'] | false
): [min: number, max: number] => [
  rtlScrollBehavior ? (rtlScrollBehavior.i ? normalizedScrollPositionMax : 0) : 0,
  getRTLCompatibleScrollPosition(
    normalizedScrollPositionMax,
    normalizedScrollPositionMax,
    rtlScrollBehavior
  ),
];

/**
 * Scroll the passed element to the passed position.
 * @param elm The element to be scrolled.
 * @param position The scroll position.
 */
export const scrollElementTo = (
  elm: HTMLElement,
  position: Partial<XY> | number | false | null | undefined
): void => {
  const { x, y } = isNumber(position) ? { x: position, y: position } : position || {};
  isNumber(x) && (elm.scrollLeft = x);
  isNumber(y) && (elm.scrollTop = y);
};

/**
 * Scroll the passed element to the passed position.
 * @param elm The element to be scrolled.
 * @param position The scroll position.
 */
export const getElmentScroll = (elm: HTMLElement): Readonly<XY> => ({
  x: elm.scrollLeft,
  y: elm.scrollTop,
});
