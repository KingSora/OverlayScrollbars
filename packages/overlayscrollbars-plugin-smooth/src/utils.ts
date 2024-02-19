import { OverlayScrollbars } from 'overlayscrollbars';
import type { Environment } from 'overlayscrollbars';
import type { AxisOverscrollInfo } from './overlayscrollbars-plugin-smooth';

export type Axis =
  // The horizontal axis.
  | 'x'
  // the vertical axis.
  | 'y';

export type XY<T> = Record<Axis, T>;

export interface AxisInfo {
  /** The related axis. */
  axis: Axis;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const isNumber = (obj: any): obj is number => typeof obj === 'number';

export const newXY0 = (): XY<number> => ({ x: 0, y: 0 });

export const newXYfalse = (): XY<boolean> => ({ x: false, y: false });

export const clamp = (min: number, max: number, current: number) =>
  Math.min(max, Math.max(min, current));

export const lerp = (from: number, to: number, percent: number) => (to - from) * percent + from;

export const damp = (from: number, to: number, damping: number, deltaTimeSeconds: number) =>
  lerp(from, to, 1 - Math.pow(damping, deltaTimeSeconds));

export const getElementsLineSize = (element: HTMLElement) =>
  parseFloat(window.getComputedStyle(element).getPropertyValue('font-size')) || 16;

export const getWheelDeltaPixelValue = (
  delta: number,
  deltaMode: number,
  pageSize: number,
  getLineSize: () => number
): number => {
  // WheelEvent.DOM_DELTA_LINE
  if (deltaMode === 1) {
    return delta * getLineSize();
  }
  // WheelEvent.DOM_DELTA_PAGE
  if (deltaMode === 2) {
    return delta * pageSize;
  }

  return delta;
};

export const perAxis = (callback: (axis: keyof XY<unknown>) => void): void =>
  (['x', 'y'] as Array<keyof XY<unknown>>).forEach(callback);

export const getAxisOverscrollInfo = (
  axis: Axis,
  delta: number,
  overflowAmount: number,
  getScroll: () => number
): AxisOverscrollInfo => {
  const axisDelta = delta;
  const axisScroll = getScroll();
  const start = axisDelta < 0 && Math.floor(axisScroll) <= 0;
  const end = axisDelta > 0 && Math.ceil(axisScroll) >= overflowAmount - 1; // -1 because of possible rounding errors
  const overscroll = start || end;

  return {
    axis,
    start,
    end,
    overscroll,
  };
};

export const getRTLScrollBehavior = (axis: Axis, osInstance: OverlayScrollbars) => {
  const { directionRTL } = osInstance.state();
  const { rtlScrollBehavior } = OverlayScrollbars.env();
  return axis === 'x' && directionRTL && rtlScrollBehavior;
};

export const createPrecisionFn = (precision: number) => {
  const precisionNumber = precision < 0 || !isFinite(precision) ? -1 : Math.pow(10, precision);
  return (value: number) =>
    precisionNumber < 0 ? value : Math.round(value * precisionNumber) / precisionNumber;
};

export const getScrollOvershoot = (scroll: number, overflowAmount: number) =>
  scroll < 0 || scroll > overflowAmount;

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
  rtlScrollBehavior?: Environment['rtlScrollBehavior'] | false | null | undefined
) =>
  rtlScrollBehavior
    ? rtlScrollBehavior.n
      ? -scrollPosition + 0 // +0 avoids negative zero (-0) as a result
      : rtlScrollBehavior.i
      ? overflowAmount - scrollPosition
      : scrollPosition
    : scrollPosition;
