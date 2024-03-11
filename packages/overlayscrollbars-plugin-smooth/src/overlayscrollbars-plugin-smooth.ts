import { type InstancePlugin } from 'overlayscrollbars';
import type { AxisInfo, XY } from './utils';
import type {
  ScrollAnimationLoop,
  ScrollAnimationLoopUpdateInfo,
} from './scrollAnimationLoop/scrollAnimationLoop';
import type { UpdateScrollAnimationLoopsFromEventInfo } from './scrollAnimationLoop/updateScrollAnimationLoopsFromEvent';
import type { VelocityEstimate } from './velocity-sampler';
import type { Fling } from './fling';
import {
  getElementsLineSize,
  getWheelDeltaPixelValue,
  isNumber,
  perAxis,
  noop,
  newXY0,
} from './utils';
import { createScrollAnimationLoop } from './scrollAnimationLoop/scrollAnimationLoop';
import { springScrollAnimation } from './scrollAnimations/springScrollAnimation';
import { easingScrollAnimation } from './scrollAnimations/easingScrollAnimation';
import { dampingScrollAnimation } from './scrollAnimations/dampingScrollAnimation';
import { createSampleFromTouchEvent, createVelocitySampler } from './velocity-sampler';
import { updateScrollAnimationLoopsFromEvent } from './scrollAnimationLoop/updateScrollAnimationLoopsFromEvent';
import { getOverflowInfo } from './overflowInfo';
import { createFling } from './fling';

export interface OverlayScrollbarsPluginSmoothOptions
  extends Pick<
      ScrollAnimationLoopUpdateInfo,
      | 'scrollAnimation'
      | 'responsiveDirectionChange'
      | 'clampToViewport'
      | 'precision'
      | 'onAnimationStart'
      | 'onAnimationStop'
      | 'onAnimationFrame'
    >,
    Pick<
      UpdateScrollAnimationLoopsFromEventInfo,
      'scrollChaining' | 'onOverscroll' | 'applyScroll'
    > {
  /**
   * A function which allows it to change the calculated wheel delta.
   * @param wheelDeltaInfo The wheel delta info.
   * @returns The altered wheel delta.
   */
  alterWheelDelta: (wheelDeltaInfo: WheelDeltaInfo) => number;
  /**
   * A function which allows it to change the calculated touch delta.
   * @param touchDeltaInfo The touch delta info.
   * @returns The altered touch delta.
   */
  alterTouchDelta: (touchDeltaInfo: TouchDeltaInfo) => number;
}

export interface WheelDeltaInfo extends AxisInfo {
  delta: number;
  event: WheelEvent;
}

export interface TouchDeltaInfo extends AxisInfo {
  delta: number;
  event: TouchEvent;
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
  scrollAnimation: dampingScrollAnimation(),
  scrollChaining: true,
  responsiveDirectionChange: true,
  clampToViewport: false,
  precision: 0,
  alterWheelDelta: ({ delta }) => delta,
  alterTouchDelta: ({ delta }) => delta,
  applyScroll: ({ axis, scroll, target }) => {
    if (isNumber(scroll)) {
      target[axis === 'x' ? 'scrollLeft' : 'scrollTop'] = scroll;
    }
  },
  onOverscroll: noop,
  onAnimationStart: noop,
  onAnimationStop: noop,
  onAnimationFrame: noop,
};

export const OverlayScrollbarsPluginSmooth = {
  osPluginSmooth: {
    instance(osInstance, event): OverlayScrollbarsPluginSmoothInstance {
      let initialized = false;
      const currentOptions: Readonly<OverlayScrollbarsPluginSmoothOptions> = defaultOptions;
      const { scrollOffsetElement, scrollEventElement } = osInstance.elements();
      const wheelScrollAnimationLoop: XY<ScrollAnimationLoop> = {
        x: createScrollAnimationLoop('x'),
        y: createScrollAnimationLoop('y'),
      };
      const touchMoveScrollAnimationLoop: XY<ScrollAnimationLoop> = {
        x: createScrollAnimationLoop('x'),
        y: createScrollAnimationLoop('y'),
      };
      const touchFlingScrollAnimationLoop: XY<ScrollAnimationLoop> = {
        x: createScrollAnimationLoop('x'),
        y: createScrollAnimationLoop('y'),
      };

      const wheel = (evt: WheelEvent) => {
        const { ctrlKey, altKey, shiftKey, deltaX: rawDeltaX, deltaY: rawDeltaY, deltaMode } = evt;
        const { alterWheelDelta } = currentOptions;
        const overflowInfo = getOverflowInfo(osInstance);

        // zoom event or other hotkey
        if (ctrlKey || altKey) {
          return;
        }

        const delta = {
          x: shiftKey ? rawDeltaY : rawDeltaX,
          y: shiftKey ? 0 : rawDeltaY,
        };

        perAxis((axis) => {
          delta[axis] = alterWheelDelta({
            axis,
            event: evt,
            delta: getWheelDeltaPixelValue(
              delta[axis],
              deltaMode,
              overflowInfo.overflowEdge[axis],
              () => getElementsLineSize(scrollOffsetElement)
            ),
          });
        });

        updateScrollAnimationLoopsFromEvent(evt, {
          delta,
          scrollAnimationLoops: wheelScrollAnimationLoop,
          overflowInfo,
          ...currentOptions,
        });
      };

      const cancelAnimationLoops = () => {
        perAxis((axis) => wheelScrollAnimationLoop[axis].cancel());
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

        const velocitySampler = createVelocitySampler();
        const scrollStartDistance = 16;
        let lastTouchPosition = newXY0();
        let lastTouchDelta = newXY0();
        let isScrolling = false;
        let lastFling: Fling | null = null;

        const touchMoveScrollAnimation = springScrollAnimation({
          spring: { perceivedDuration: 333, bounce: 0 },
        });
        const flingScrollAnimation = springScrollAnimation({
          spring: { perceivedDuration: 777, bounce: -1 },
        });

        scrollOffsetElement.addEventListener(
          'touchstart',
          (e) => {
            const { touches, cancelable } = e;
            const [touch] = touches;

            lastTouchPosition = lastTouchDelta = {
              x: touch.pageX,
              y: touch.pageY,
            };

            wheelScrollAnimationLoop.x.cancel();
            wheelScrollAnimationLoop.y.cancel();
            touchMoveScrollAnimationLoop.x.cancel();
            touchMoveScrollAnimationLoop.y.cancel();
            touchFlingScrollAnimationLoop.x.cancel();
            touchFlingScrollAnimationLoop.y.cancel();

            velocitySampler.addSample(createSampleFromTouchEvent(e));

            if (isScrolling && cancelable) {
              e.preventDefault();
            }
          },
          {
            passive: false,
          }
        );

        scrollOffsetElement.addEventListener(
          'touchmove',
          (e) => {
            const { alterTouchDelta } = currentOptions;
            const overflowInfo = getOverflowInfo(osInstance);

            // todo: distinguish pinch from scroll
            // todo: stacking fling

            const [touch] = e.changedTouches;

            const newTouchPosition = {
              x: touch.pageX,
              y: touch.pageY,
            };
            const touchPositionDelta = {
              x: newTouchPosition.x - lastTouchPosition.x,
              y: newTouchPosition.y - lastTouchPosition.y,
            };
            const delta = {
              x: -touchPositionDelta.x,
              y: -touchPositionDelta.y,
            };

            perAxis((axis) => {
              delta[axis] = alterTouchDelta({
                axis,
                event: e,
                delta: delta[axis],
              });
            });

            const appliedDelta = updateScrollAnimationLoopsFromEvent(e, {
              delta,
              scrollAnimationLoops: touchMoveScrollAnimationLoop,
              overflowInfo,
              ...currentOptions,
              scrollAnimation: touchMoveScrollAnimation,
              responsiveDirectionChange: false,
            });

            // displacement wasn't big enough, touch could've also been a tap
            if (
              !isScrolling &&
              Math.abs(appliedDelta.x) < scrollStartDistance &&
              Math.abs(appliedDelta.y) < scrollStartDistance
            ) {
              touchMoveScrollAnimationLoop.x.cancel();
              touchMoveScrollAnimationLoop.y.cancel();
              return;
            }

            isScrolling = true;
            lastTouchPosition = newTouchPosition;
            lastTouchDelta = appliedDelta;

            velocitySampler.addSample(createSampleFromTouchEvent(e));
          },
          {
            passive: false,
          }
        );

        scrollOffsetElement.addEventListener(
          'touchend',
          (e) => {
            if (!isScrolling) {
              return;
            }

            const { timeStamp } = e;
            const overflowInfo = getOverflowInfo(osInstance);

            // always add last sample here, event if the position data is similar to the last move event to get the correct timestamp data
            velocitySampler.addSample(createSampleFromTouchEvent(e));

            const velocityEstimate = velocitySampler.getVelocityEstimate();

            if (!velocityEstimate) {
              return;
            }

            const fling = createFling(velocityEstimate, timeStamp, lastFling);
            const xMoveLoop = touchMoveScrollAnimationLoop.x.state();
            const yMoveLoop = touchMoveScrollAnimationLoop.y.state();

            const appliedDelta = updateScrollAnimationLoopsFromEvent(e, {
              delta: {
                x: xMoveLoop.scrollDelta + fling.delta.x,
                y: yMoveLoop.scrollDelta + fling.delta.y,
              },
              scrollAnimationLoops: touchFlingScrollAnimationLoop,
              overflowInfo,
              ...currentOptions,
              scrollAnimation: flingScrollAnimation,
              onAnimationStop(animationInfo) {
                isScrolling = false;
                currentOptions.onAnimationStop(animationInfo);
              },
            });

            perAxis((axis) => {
              const axisLastTouchDelta = lastTouchDelta[axis];
              const axisAppliedDelta = appliedDelta[axis];

              // fling goes in different direction
              if (Math.sign(axisLastTouchDelta) !== Math.sign(axisAppliedDelta)) {
                touchFlingScrollAnimationLoop[axis].cancel();
                return;
              }

              // fling animation takes over move animation
              if (axisAppliedDelta) {
                touchMoveScrollAnimationLoop[axis].cancel();
              }
            });

            if (!appliedDelta.x && !appliedDelta.y) {
              isScrolling = false;
              lastFling = null;
            } else {
              lastFling = fling;
            }

            e.preventDefault();
          },
          {
            passive: false,
          }
        );
        scrollOffsetElement.addEventListener('pointercancel', () => {
          touchFlingScrollAnimationLoop.x.cancel();
          touchFlingScrollAnimationLoop.y.cancel();
          touchMoveScrollAnimationLoop.x.cancel();
          touchMoveScrollAnimationLoop.y.cancel();
          isScrolling = false;
        });
        window.addEventListener('blur', cancelAnimationLoops);

        initialized = true;
      };

      const destroy = () => {
        (scrollEventElement as HTMLElement).removeEventListener('wheel', wheel);
        scrollOffsetElement.removeEventListener('mousedown', mouseMiddleButtonDown);
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
