import type { InstancePlugin } from 'overlayscrollbars';
import type {
  AxisScrollAnimationState,
  ScrollAnimation,
  ScrollAnimationFrameInfo,
  ScrollAnimationFrameResult,
} from './scrollAnimation';
import type { AxisInfo, XY } from './utils';
import type { AxisScrollAnimationLoop } from './scrollAnimationLoop';
import {
  convertScrollPosition,
  getElementsLineSize,
  getWheelDeltaPixelValue,
  isNumber,
  getAxisOverscrollInfo,
  perAxis,
  noop,
  getRTLScrollBehavior,
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
  /**
   * The fractional precision of the scroll position numbers.
   * Lower precision is better for performance because this can also affect the scroll animation stop timing.
   * Can be Infinity. Negative precision is interpreted as Infinity.
   */
  precision: number;
  /**
   * A function which allows it to change the calculated wheel delta.
   * @param wheelDeltaInfo The wheel delta info.
   * @returns The altered wheel delta.
   */
  alterWheelDelta: (wheelDeltaInfo: AxisWheelDeltaInfo) => number;
  /** Function which applies the scroll value. */
  applyScroll: (applyScrollInfo: AxisApplyScrollInfo) => void;
  /** Callback when overscroll occurs. */
  onOverscroll: (overscrollInfo: AxisOverscrollInfo) => void;
  /** Callback when the scroll animation loop starts. */
  onAnimationStart: (animationInfo: AxisAnimationInfo) => void;
  /** Callback when the scroll animation loop stops. */
  onAnimationStop: (animationInfo: AxisAnimationInfo) => void;
  /** Callback when the scroll animation loop was canceled. */
  onAnimationCancel: (animationInfo: AxisAnimationInfo) => void;
  /** Callback when the scroll animation loop finished a frame. */
  onAnimationFrame: (frameInfo: AxisAnimationFrameInfo) => void;
}

export interface AxisWheelDeltaInfo extends AxisInfo {
  delta: number;
  event: WheelEvent;
}

export interface AxisApplyScrollInfo extends AxisInfo {
  /** The scroll position to apply. If a scroll position equals `false` there was no change to the scroll position. */
  scroll: number | false;
  /** The element to which the scroll positions should be applied to. */
  target: HTMLElement;
}

export interface AxisOverscrollInfo extends AxisInfo {
  /** Whether there is any overscroll. */
  overscroll: boolean;
  /** Whether there is a "start" overscroll. */
  start: boolean;
  /** Whether there is a "end" overscroll. */
  end: boolean;
}

export interface AxisAnimationInfo extends AxisInfo {
  /** The state of the animation. */
  state: AxisScrollAnimationState;
  /** The frame info. */
  frameInfo: ScrollAnimationFrameInfo;
}

export interface AxisAnimationFrameInfo extends AxisAnimationInfo {
  /** The frame result. */
  frameResult: ScrollAnimationFrameResult;
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
  alterWheelDelta: ({ delta }) => delta,
  applyScroll: ({ axis, scroll, target }) => {
    if (isNumber(scroll)) {
      target[axis === 'x' ? 'scrollLeft' : 'scrollTop'] = scroll;
    }
  },
  onOverscroll: noop,
  onAnimationStart: noop,
  onAnimationStop: noop,
  onAnimationCancel: noop,
  onAnimationFrame: noop,
};

export const OverlayScrollbarsPluginSmooth = {
  osPluginSmooth: {
    instance(osInstance, event): OverlayScrollbarsPluginSmoothInstance {
      let initialized = false;
      const currentOptions: Readonly<OverlayScrollbarsPluginSmoothOptions> = defaultOptions;
      const { scrollOffsetElement, scrollEventElement, scrollbarHorizontal, scrollbarVertical } =
        osInstance.elements();
      const animationLoop: XY<AxisScrollAnimationLoop> = {
        x: createScrollAnimationLoop('x', currentOptions, osInstance),
        y: createScrollAnimationLoop('y', currentOptions, osInstance),
      };
      const scrollbarMouseDown: XY<() => void> = {
        x: () => {
          animationLoop.x.cancel();
        },
        y: () => {
          animationLoop.y.cancel();
        },
      };
      const cancelAnimationLoops = () => {
        perAxis((axis) => animationLoop[axis].cancel());
      };

      const wheel = (evt: WheelEvent) => {
        const { ctrlKey, deltaX: rawDeltaX, deltaY: rawDeltaY, deltaMode } = evt;

        // zoom event
        if (ctrlKey) {
          return;
        }

        const { scrollChaining, alterWheelDelta, onOverscroll } = currentOptions;
        const { overflowEdge, overflowAmount, overflowStyle, hasOverflow } = osInstance.state();

        if (!hasOverflow.x && !hasOverflow.y) {
          return;
        }

        perAxis((axis) => {
          const axisOverflowAmount = overflowAmount[axis];
          const isHorizontal = axis === 'x';
          const canHaveScrollDelta = hasOverflow[axis] && overflowStyle[axis] === 'scroll';
          const delta = canHaveScrollDelta
            ? alterWheelDelta({
                axis,
                event: evt,
                delta: getWheelDeltaPixelValue(
                  isHorizontal ? rawDeltaX : rawDeltaY,
                  deltaMode,
                  overflowEdge[axis],
                  () => getElementsLineSize(scrollOffsetElement)
                ),
              })
            : 0;

          if (!delta) {
            return;
          }

          // get scroll lazily to not cause browser reflow when its not necessary
          const getScroll = () =>
            convertScrollPosition(
              isHorizontal ? scrollOffsetElement.scrollLeft : scrollOffsetElement.scrollTop,
              axisOverflowAmount,
              getRTLScrollBehavior(axis, osInstance)
            );

          const animationLoopRunning = animationLoop[axis].isRunning();
          const overScrollInfo =
            !animationLoopRunning &&
            getAxisOverscrollInfo(axis, delta, axisOverflowAmount, getScroll);

          // if animation is running or no scroll chaining or no overscroll prevent default
          if (
            animationLoopRunning ||
            !scrollChaining ||
            (overScrollInfo && !overScrollInfo.overscroll)
          ) {
            evt.preventDefault();
          }

          if (overScrollInfo && overScrollInfo.overscroll) {
            onOverscroll(overScrollInfo);
          }
          // only update the animation loop if there is no overscroll
          else {
            animationLoop[axis].update({
              delta,
              getScroll,
            });
          }
        });
      };
      const mouseMiddleButtonDown = (evt: MouseEvent) => {
        const { button } = evt;
        if (button === 1) {
          cancelAnimationLoops();
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
        scrollbarHorizontal.scrollbar.addEventListener('mousedown', scrollbarMouseDown.x);
        scrollbarVertical.scrollbar.addEventListener('mousedown', scrollbarMouseDown.y);
        window.addEventListener('blur', cancelAnimationLoops);

        initialized = true;
      };

      const destroy = () => {
        (scrollEventElement as HTMLElement).removeEventListener('wheel', wheel);
        scrollOffsetElement.removeEventListener('mousedown', mouseMiddleButtonDown);
        scrollbarHorizontal.scrollbar.removeEventListener('mousedown', scrollbarMouseDown.x);
        scrollbarVertical.scrollbar.removeEventListener('mousedown', scrollbarMouseDown.y);
        window.removeEventListener('blur', cancelAnimationLoops);

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
