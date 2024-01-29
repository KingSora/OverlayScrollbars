import type { Env } from '~/environment';
import type { XY } from './offset';
import { capNumber, isNumber } from '../utils';

export type RTLScrollBehavior = Env['_rtlScrollBehavior'] | false | null | undefined;

/**
 * Transforms a normalized scroll position to a RTL compatilbe scroll position value or vice versa (depending on the input format).
 * @param scrollPosition The scroll position value.
 * @param overflowAmount The (normalized) overflow amount value.
 * @param rtlScrollBehavior The RTL scroll behavior or `falsy` if the rtl scroll behavior doesn't apply.
 * @returns The input scroll position, just converted.
 * If the input `scrollPosition` is normalized the raw (RTL Compatible) format is returned.
 * If the input `scrollPosition` is raw (RTL Compatible) the normalized format is returned.
 */
export const convertScrollPosition = (
  scrollPosition: number,
  overflowAmount: number,
  rtlScrollBehavior?: RTLScrollBehavior
) =>
  rtlScrollBehavior
    ? rtlScrollBehavior.n
      ? -scrollPosition + 0 // +0 avoids negative zero (-0) as a result
      : rtlScrollBehavior.i
      ? overflowAmount - scrollPosition
      : scrollPosition
    : scrollPosition;

/**
 * Gets the raw (RTL compatilbe) scroll boundaries from the normalized overflow amount.
 * @param overflowAmount The normalzed overflow amount value.
 * @param rtlScrollBehavior The RTL scroll behavior or `falsy` if the rtl scroll behavior doesn't apply.
 * @returns The raw (RTL compatible) scroll boundaries. (min value will scroll to start (0%) and max will scroll to end (100%))
 */
export const getRawScrollBounds = (
  overflowAmount: number,
  rtlScrollBehavior?: RTLScrollBehavior
): [min: number, max: number] => [
  convertScrollPosition(0, overflowAmount, rtlScrollBehavior),
  convertScrollPosition(overflowAmount, overflowAmount, rtlScrollBehavior),
];

/**
 * Gets the scroll ratio of the current raw (RTL compatilbe) scroll position.
 * @param rawScrollPosition The raw (RTL compatible) scroll position.
 * @param overflowAmount The normalized overflow amount.
 * @param rtlScrollBehavior The RTL scroll behavior or `falsy` if the rtl scroll behavior doesn't apply.
 * @returns The scroll ratio of the current scroll position 0..1.
 */
export const getRawScrollRatio = (
  rawScrollPosition: number,
  overflowAmount: number,
  rtlScrollBehavior?: RTLScrollBehavior
) =>
  capNumber(
    0,
    1,
    convertScrollPosition(rawScrollPosition, overflowAmount, rtlScrollBehavior) / overflowAmount
  );

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
