import { OverlayScrollbars, type InstancePlugin } from 'overlayscrollbars';
import type { Environment } from 'overlayscrollbars';
import type {
  ScrollAnimation,
  ScrollAnimationFrameInfo,
  ScrollAnimationFrameResult,
} from './scrollAnimation';
import { isNumber, type XY } from './utils';
import { createScrollAnimationLoop } from './scrollAnimationLoop';
import { dampingScrollAnimation } from './dampingScrollAnimation';
import { clamp } from './math';
import { easingScrollAnimation } from './easingScrollAnimation';

export interface OverlayScrollbarsPluginSmoothOptions {
  /** The scroll animation. */
  scrollAnimation: ScrollAnimation;
  /** Whether scroll chaining is enabled. */
  scrollChaining: boolean;
  /**
   * A function which allows it to change the calculated wheel delta.
   * @param wheelDelta The "original" wheel delta for the horizontal (X) and vertical (Y) axis in pixels.
   * @param event The wheel event from which the wheel delta was calculated from.
   * @returns The altered wheel delta.
   */
  alterWheelDelta: (wheelDelta: XY<number>, event: WheelEvent) => XY<number>;
  /** Function which applies the scroll value */
  applyScroll: (applyScrollInfo: ApplyScrollInfo) => void;
  /** Callback when overscroll occurs. */
  onOverscroll?: (overscrollInfo: OverscrollInfo) => void;
  /** Callback when the scroll animation loop starts. */
  onAnimationStart?: (frameInfo: ScrollAnimationFrameInfo) => void;
  /** Callback when the scroll animation loop stops. */
  onAnimationStop?: (frameInfo: ScrollAnimationFrameInfo) => void;
  /** Callback when the scroll animation loop was canceled. */
  onAnimationCancel?: (frameInfo: ScrollAnimationFrameInfo) => void;
  /** Callback when the scroll animation loop finished a frame. */
  onAnimationFrame?: (
    frameInfo: ScrollAnimationFrameInfo,
    frameResult?: ScrollAnimationFrameResult
  ) => void;
}

export interface ApplyScrollInfo {
  scroll: XY<number | false>;
  target: HTMLElement;
}

export interface OverscrollInfo {
  overscroll: XY<boolean>;
  overscrollStart: XY<boolean>;
  overscrollEnd: XY<boolean>;
}

export interface OverlayScrollbarsPluginSmoothInstance {
  initialize: () => void;
  destroy: () => void;
  update: () => void;
}

const defaultOptions: OverlayScrollbarsPluginSmoothOptions = {
  scrollAnimation: easingScrollAnimation(), //dampingScrollAnimation(),
  scrollChaining: true,
  alterWheelDelta: (wheelDelta) => wheelDelta,
  applyScroll: ({ target, scroll }) => {
    if (isNumber(scroll.x)) {
      target.scrollLeft = scroll.x;
    }
    if (isNumber(scroll.y)) {
      target.scrollTop = scroll.y;
    }
  },
};

const getElementsLineSize = (element: HTMLElement) =>
  parseFloat(window.getComputedStyle(element).getPropertyValue('font-size')) || 16;

const getWheelDeltaPixelValue = (
  delta: number,
  deltaMode: number,
  getPageSize: () => number,
  getLineSize: () => number
): number => {
  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return delta * getPageSize();
  }
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return delta * getLineSize();
  }

  return delta;
};

/**
 * Transforms a normalized scroll position to a RTL compatilbe scroll position value or vice versa (depending on the input format).
 * @param scrollPosition The scroll position value.
 * @param overflowAmount The (normalized) overflow amount value.
 * @param rtlScrollBehavior The RTL scroll behavior or `falsy` if the rtl scroll behavior doesn't apply.
 * @returns The input scroll position, just converted.
 * If the input `scrollPosition` is normalized the raw (RTL Compatible) format is returned.
 * If the input `scrollPosition` is raw (RTL Compatible) the normalized format is returned.
 */
const convertScrollPosition = (
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

export const OverlayScrollbarsPluginSmooth = {
  osPluginSmooth: {
    instance(osInstance, event) {
      const currentOptions: Readonly<OverlayScrollbarsPluginSmoothOptions> = defaultOptions;
      const scrollAnimationLoop = createScrollAnimationLoop(osInstance);

      const { scrollOffsetElement, scrollEventElement, scrollbarHorizontal, scrollbarVertical } =
        osInstance.elements();
      const { rtlScrollBehavior: envRtlScrollBehavior } = OverlayScrollbars.env();

      const wheel = (evt: WheelEvent) => {
        const { ctrlKey, deltaX: rawDeltaX, deltaY: rawDeltaY, deltaMode } = evt;

        // zoom event
        if (ctrlKey) {
          return;
        }

        const { scrollChaining, alterWheelDelta, applyScroll, onOverscroll, onAnimationFrame } =
          currentOptions;
        const { overflowEdge, overflowAmount, directionRTL } = osInstance.state();
        const { scrollLeft, scrollTop } = scrollOffsetElement;
        const rtlScrollBehavior = directionRTL && envRtlScrollBehavior;
        const delta = alterWheelDelta(
          {
            x: getWheelDeltaPixelValue(
              rawDeltaX,
              deltaMode,
              () => overflowEdge.x,
              () => getElementsLineSize(scrollOffsetElement)
            ),
            y: getWheelDeltaPixelValue(
              rawDeltaY,
              deltaMode,
              () => overflowEdge.y,
              () => getElementsLineSize(scrollOffsetElement)
            ),
          },
          evt
        );
        const scroll = {
          x: convertScrollPosition(scrollLeft, overflowAmount.x, directionRTL && rtlScrollBehavior),
          y: convertScrollPosition(scrollTop, overflowAmount.y),
        };
        const overscrollStart = {
          x: delta.x < 0 && scroll.x <= 0,
          y: delta.y < 0 && scroll.y <= 0,
        };
        const overscrollEnd = {
          x: delta.x > 0 && scroll.x >= overflowAmount.x,
          y: delta.y > 0 && scroll.y >= overflowAmount.y,
        };
        const overscroll = {
          x: overscrollStart.x || overscrollEnd.x,
          y: overscrollStart.y || overscrollEnd.y,
        };
        const anyOverscroll = overscroll.x || overscroll.y;
        const anyDelta = delta.x || delta.y;

        // if animation is running or no scroll chaining always prevent default
        if (scrollAnimationLoop.isRunning() || !scrollChaining) {
          evt.preventDefault();
        }
        // otherwise only prevent default if there is no overscroll
        else if (!overscroll.x && !overscroll.y) {
          evt.preventDefault();
        }

        // trigger overscroll callback if there is any overscroll and no animation is running
        if (!scrollAnimationLoop.isRunning() && anyOverscroll) {
          onOverscroll &&
            onOverscroll({
              overscroll,
              overscrollStart,
              overscrollEnd,
            });
        }

        // only update the animation loop if there is no overscroll
        if (anyDelta && !anyOverscroll) {
          scrollAnimationLoop.update(
            {
              ...currentOptions,
              onAnimationFrame(frameInfo, frameResult) {
                const { scroll: resultScroll } = frameResult || {};

                if (resultScroll) {
                  applyScroll({
                    scroll: {
                      x:
                        isNumber(resultScroll.x) &&
                        convertScrollPosition(
                          clamp(0, overflowAmount.x, resultScroll.x),
                          overflowAmount.x,
                          rtlScrollBehavior
                        ),
                      y:
                        isNumber(resultScroll.y) &&
                        convertScrollPosition(
                          clamp(0, overflowAmount.y, resultScroll.y),
                          overflowAmount.y
                        ),
                    },
                    target: scrollOffsetElement,
                  });
                }

                onAnimationFrame && onAnimationFrame(frameInfo, frameResult);
              },
            },
            {
              delta,
              scroll,
            }
          );
        }
      };

      const scrollbarMouseDown = () => {
        scrollAnimationLoop.cancel();
      };

      const initialize = (initOptions?: Partial<OverlayScrollbarsPluginSmoothOptions>) => {
        Object.assign(currentOptions, initOptions || {});

        (scrollEventElement as HTMLElement).addEventListener('wheel', wheel);
        scrollbarHorizontal.scrollbar.addEventListener('mousedown', scrollbarMouseDown);
        scrollbarVertical.scrollbar.addEventListener('mousedown', scrollbarMouseDown);
      };

      const destroy = () => {
        (scrollEventElement as HTMLElement).removeEventListener('wheel', wheel);
        scrollbarHorizontal.scrollbar.removeEventListener('mousedown', scrollbarMouseDown);
        scrollbarVertical.scrollbar.removeEventListener('mousedown', scrollbarMouseDown);
      };

      const options = (
        newOptions: Partial<OverlayScrollbarsPluginSmoothOptions>,
        pure?: boolean
      ) => {
        Object.assign(currentOptions, pure ? defaultOptions : {}, newOptions);
      };

      event('destroyed', destroy);

      return {
        initialize,
        options,
        destroy,
      };
    },
  },
} satisfies InstancePlugin;
