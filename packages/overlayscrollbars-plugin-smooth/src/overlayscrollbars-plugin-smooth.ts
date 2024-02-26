import { type InstancePlugin } from 'overlayscrollbars';
import type { AxisInfo, XY } from './utils';
import type {
  ScrollAnimationLoop,
  ScrollAnimationLoopUpdateInfo,
} from './scrollAnimationLoop/scrollAnimationLoop';
import type { UpdateScrollAnimationLoopsFromEventInfo } from './scrollAnimationLoop/updateScrollAnimationLoopsFromEvent';
import { getElementsLineSize, getWheelDeltaPixelValue, isNumber, perAxis, noop } from './utils';
import { createScrollAnimationLoop } from './scrollAnimationLoop/scrollAnimationLoop';
import { springScrollAnimation } from './scrollAnimations/springScrollAnimation';
import { easingScrollAnimation } from './scrollAnimations/easingScrollAnimation';
import { dampingScrollAnimation } from './scrollAnimations/dampingScrollAnimation';
import { createVelocitySampler } from './velocity-tracker';
import { updateScrollAnimationLoopsFromEvent } from './scrollAnimationLoop/updateScrollAnimationLoopsFromEvent';
import { getOverflowInfo } from './overflowInfo';

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

        const vTracker = createVelocitySampler();
        const scrollStartDistance = 8;
        const currTouch = {
          x: 0,
          y: 0,
        };
        let isScrolling = false;

        scrollOffsetElement.addEventListener(
          'touchstart',
          (e) => {
            const { touches, cancelable, timeStamp } = e;
            const [touch] = touches;

            currTouch.x = touch.pageX;
            currTouch.y = touch.pageY;

            wheelScrollAnimationLoop.x.cancel();
            wheelScrollAnimationLoop.y.cancel();
            touchMoveScrollAnimationLoop.x.cancel();
            touchMoveScrollAnimationLoop.y.cancel();
            touchFlingScrollAnimationLoop.x.cancel();
            touchFlingScrollAnimationLoop.y.cancel();

            vTracker.addSample({
              _position: currTouch,
              _timestamp: timeStamp,
            });

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

            const [touch] = e.touches;

            const newTouch = {
              x: touch.pageX,
              y: touch.pageY,
            };
            const touchDelta = {
              x: newTouch.x - currTouch.x,
              y: newTouch.y - currTouch.y,
            };
            const delta = {
              x: -touchDelta.x,
              y: -touchDelta.y,
            };

            perAxis((axis) => {
              delta[axis] = alterTouchDelta({
                axis,
                event: e,
                delta: delta[axis],
              });
            });

            wheelScrollAnimationLoop.x.cancel();
            wheelScrollAnimationLoop.y.cancel();
            touchFlingScrollAnimationLoop.x.cancel();
            touchFlingScrollAnimationLoop.y.cancel();

            const appliedDelta = updateScrollAnimationLoopsFromEvent(e, {
              delta,
              scrollAnimationLoops: touchMoveScrollAnimationLoop,
              overflowInfo,
              ...currentOptions,
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

            currTouch.x = newTouch.x;
            currTouch.y = newTouch.y;

            vTracker.addSample({
              _position: newTouch,
              _timestamp: e.timeStamp,
            });
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

            const overflowInfo = getOverflowInfo(osInstance);
            const [touch] = e.changedTouches;

            vTracker.addSample({
              _position: {
                x: touch.pageX,
                y: touch.pageY,
              },
              _timestamp: e.timeStamp,
            });

            const veloc = vTracker.getVelocity();
            const damping = 0.01;

            const decelerationRate = 1 - damping;
            const dCoeff = 1000 * Math.log(decelerationRate);

            const delta = {
              x: veloc.x / dCoeff,
              y: veloc.y / dCoeff,
            };

            touchMoveScrollAnimationLoop.x.cancel();
            touchMoveScrollAnimationLoop.y.cancel();

            const appliedDelta = updateScrollAnimationLoopsFromEvent(e, {
              delta,
              scrollAnimationLoops: touchFlingScrollAnimationLoop,
              overflowInfo,
              ...currentOptions,
              onAnimationStop(animationInfo) {
                isScrolling = false;
                currentOptions.onAnimationStop(animationInfo);
              },
            });

            if (!appliedDelta.x && !appliedDelta.y) {
              isScrolling = false;
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
