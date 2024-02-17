import { OverlayScrollbars, type InstancePlugin } from 'overlayscrollbars';
import type {
  ScrollAnimation,
  ScrollAnimationFrameInfo,
  ScrollAnimationFrameResult,
} from './scrollAnimation';
import type { XY } from './utils';
import {
  convertScrollPosition,
  getElementsLineSize,
  getWheelDeltaPixelValue,
  isNumber,
  clamp,
  getOverscrollInfo,
  perAxis,
} from './utils';
import { createScrollAnimationLoop } from './scrollAnimationLoop';
import { springScrollAnimation } from './springScrollAnimation';
import { easingScrollAnimation } from './easingScrollAnimation';
import { dampingScrollAnimation } from './dampingScrollAnimation';

export interface OverlayScrollbarsPluginSmoothOptions {
  /** The scroll animation. */
  scrollAnimation: ScrollAnimation;
  /** Whether scroll chaining is enabled. */
  scrollChaining: boolean;
  /** Whether scroll direction changes are applied instantly instead of animated. */
  responsiveDirectionChange: boolean;
  /**
   * Whether the destination scroll position is always clamped to the viewport edges.
   * Enabling this will cause the velocity to always drop near the viewport edges which causes the animation to feel smoother but less responsive near the edges.
   */
  clampToViewport: boolean;
  /** The fractional precision of the scroll position numbers. Can be Infinity. Negative precision is interpreted as Infinity. */
  precision: number;
  /**
   * A function which allows it to change the calculated wheel delta.
   * @param wheelDelta The "original" wheel delta for the horizontal (X) and vertical (Y) axis in pixels.
   * @param event The wheel event from which the wheel delta was calculated from.
   * @returns The altered wheel delta.
   */
  alterWheelDelta: (wheelDelta: XY<number>, event: WheelEvent) => XY<number>;
  /** Function which applies the scroll value. */
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
  /** The scroll positions to apply. If a scroll position equals `false` there was no change to the scroll position. */
  scroll: XY<number | false>;
  /** The element to which the scroll positions should be applied to. */
  target: HTMLElement;
}

export interface OverscrollInfo {
  /** Whether there is any overscroll. */
  overscroll: XY<boolean>;
  /** Whether there a "start" overscroll. */
  overscrollStart: XY<boolean>;
  /** Whether there a "end" overscroll. */
  overscrollEnd: XY<boolean>;
}

export interface OverlayScrollbarsPluginSmoothInstance {
  /**
   * Initializes the plugin with the passed initial options.
   * @param initOptions The initial options.
   */
  initialize: (initOptions?: Partial<OverlayScrollbarsPluginSmoothOptions>) => void;
  /**
   * Destroys the plugin.
   */
  destroy: () => void;
  /**
   * Sets the options of the instance.
   * If the new options are partially filled, they're merged with either the current options or the default options.
   * @param newOptions The new options which should be applied.
   * @param pure Whether the options should be reset before the new options are added.
   * @returns Returns the current options of the instance.
   */
  options: (
    newOptions?: Partial<OverlayScrollbarsPluginSmoothOptions>,
    pure?: boolean
  ) => OverlayScrollbarsPluginSmoothOptions;
}

const defaultOptions: OverlayScrollbarsPluginSmoothOptions = {
  scrollAnimation: springScrollAnimation(),
  scrollChaining: true,
  responsiveDirectionChange: true,
  clampToViewport: false,
  precision: 0,
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

export const OverlayScrollbarsPluginSmooth = {
  osPluginSmooth: {
    instance(osInstance, event): OverlayScrollbarsPluginSmoothInstance {
      let initialized = false;
      const currentOptions: Readonly<OverlayScrollbarsPluginSmoothOptions> = defaultOptions;
      const { scrollOffsetElement, scrollEventElement, scrollbarHorizontal, scrollbarVertical } =
        osInstance.elements();
      const { rtlScrollBehavior: envRtlScrollBehavior } = OverlayScrollbars.env();
      const scrollAnimationLoop = createScrollAnimationLoop(osInstance);

      const wheel = (evt: WheelEvent) => {
        const { ctrlKey, deltaX: rawDeltaX, deltaY: rawDeltaY, deltaMode } = evt;

        // zoom event
        if (ctrlKey) {
          return;
        }

        const { scrollChaining, alterWheelDelta, applyScroll, onOverscroll, onAnimationFrame } =
          currentOptions;
        const { overflowEdge, overflowAmount, overflowStyle, hasOverflow, directionRTL } =
          osInstance.state();
        const { scrollLeft, scrollTop } = scrollOffsetElement;
        const rtlScrollBehavior = directionRTL && envRtlScrollBehavior;

        if (!hasOverflow.x && !hasOverflow.y) {
          return;
        }

        const originalWheelDelta = {
          x: rawDeltaX,
          y: rawDeltaY,
        };
        perAxis((axis) => {
          const canHaveScrollDelta = hasOverflow[axis] && overflowStyle[axis] === 'scroll';
          originalWheelDelta[axis] = canHaveScrollDelta
            ? getWheelDeltaPixelValue(originalWheelDelta[axis], deltaMode, overflowEdge[axis], () =>
                getElementsLineSize(scrollOffsetElement)
              )
            : 0;
        });
        const delta = alterWheelDelta(originalWheelDelta, evt);

        if (!delta.x && !delta.y) {
          return;
        }

        // get scroll lazily to not cause browser reflow when its not necessary
        const getScroll = () => ({
          x: convertScrollPosition(scrollLeft, overflowAmount.x, directionRTL && rtlScrollBehavior),
          y: convertScrollPosition(scrollTop, overflowAmount.y),
        });
        const animationLoopRunning = scrollAnimationLoop.isRunning();
        const overScrollInfo =
          !animationLoopRunning && getOverscrollInfo(delta, overflowAmount, getScroll);
        const anyOverscroll =
          overScrollInfo && (overScrollInfo.overscroll.x || overScrollInfo.overscroll.y);

        // if animation is running or no scroll chaining always prevent default
        if (animationLoopRunning || !scrollChaining) {
          evt.preventDefault();
        }
        // otherwise only prevent default if there is no overscroll
        else if (!anyOverscroll) {
          evt.preventDefault();
        }

        if (anyOverscroll) {
          onOverscroll && onOverscroll(overScrollInfo);
        }
        // only update the animation loop if there is no overscroll
        else {
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
              getScroll,
            }
          );
        }
      };
      const scrollbarMouseDown = () => {
        scrollAnimationLoop.cancel();
      };
      const mouseMiddleButtonDown = (evt: MouseEvent) => {
        const { button } = evt;
        if (button === 1) {
          scrollbarMouseDown();
        }
      };

      const initialize = (initOptions?: Partial<OverlayScrollbarsPluginSmoothOptions>) => {
        if (initialized) {
          return;
        }

        Object.assign(currentOptions, initOptions || {});

        (scrollEventElement as HTMLElement).addEventListener('wheel', wheel, {
          passive: false,
        });
        scrollOffsetElement.addEventListener('mousedown', mouseMiddleButtonDown);
        scrollbarHorizontal.scrollbar.addEventListener('mousedown', scrollbarMouseDown);
        scrollbarVertical.scrollbar.addEventListener('mousedown', scrollbarMouseDown);
        scrollbarVertical.scrollbar.addEventListener('mousedown', scrollbarMouseDown);
        window.addEventListener('blur', scrollbarMouseDown);

        initialized = true;
      };

      const destroy = () => {
        (scrollEventElement as HTMLElement).removeEventListener('wheel', wheel);
        scrollOffsetElement.removeEventListener('mousedown', mouseMiddleButtonDown);
        scrollbarHorizontal.scrollbar.removeEventListener('mousedown', scrollbarMouseDown);
        scrollbarVertical.scrollbar.removeEventListener('mousedown', scrollbarMouseDown);
        window.removeEventListener('blur', scrollbarMouseDown);

        initialized = false;
      };

      const options = (
        newOptions?: Partial<OverlayScrollbarsPluginSmoothOptions>,
        pure?: boolean
      ) => {
        Object.assign(currentOptions, pure ? defaultOptions : {}, newOptions);
        return { ...currentOptions };
      };

      event('destroyed', destroy);

      return {
        initialize,
        destroy,
        options,
      };
    },
  },
} satisfies InstancePlugin;
