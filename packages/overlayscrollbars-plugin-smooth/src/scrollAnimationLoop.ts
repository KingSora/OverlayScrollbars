import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimationFrameResult } from './scrollAnimation';
import type { OverlayScrollbarsPluginSmoothOptions } from './overlayscrollbars-plugin-smooth';
import type { Axis } from './utils';
import {
  clamp,
  convertScrollPosition,
  createPrecisionFn,
  getRTLScrollBehavior,
  getScrollOvershoot,
  isNumber,
} from './utils';

export interface AxisScrollAnimationLoop {
  /** Function which returns whether the scroll animation loop is running. */
  isRunning(): boolean;
  /** Starts / Updates the scroll animation loop. */
  update(info: Readonly<AxisScrollAnimationLoopUpdateInfo>): void;
  /** Cancels (stops) the scroll animation loop. */
  cancel(): void;
}

export interface AxisScrollAnimationLoopUpdateInfo {
  /** The wheel delta in pixel. */
  delta: number;
  /** Function to get the current scroll value in pixel. Should be used sparingly because of possible browser reflow. */
  getScroll: () => number;
}

export const createScrollAnimationLoop = (
  axis: Axis,
  options: Readonly<OverlayScrollbarsPluginSmoothOptions>,
  osInstance: OverlayScrollbars
): AxisScrollAnimationLoop => {
  let animationFrameId: ReturnType<typeof requestAnimationFrame> | undefined;
  let averageDeltaTime = 1000 / 60; // assume 60fps
  let currentScroll = 0;
  let updateScroll = 0;
  let overflowAmount = 0;
  let destinationScroll = 0;
  let destinationScrollClamped = 0;
  let direction = 0;
  let directionChanged = false;
  let currentTime = 0;
  let deltaTime = 0;
  let updateTime = 0;
  let previousTime: number | undefined;
  let precision = (v: number) => v;

  const { scrollOffsetElement } = osInstance.elements();

  const getFrameInfo = (frameTime?: number) => {
    if (frameTime) {
      currentTime = frameTime;
      deltaTime = previousTime ? frameTime - previousTime : averageDeltaTime;
      updateTime = updateTime || currentTime;
    }

    return {
      currentTime,
      deltaTime,
      updateTime,
      previousTime,
    };
  };

  const getScrollAnimationState = (
    updateLoopInfo?: Readonly<AxisScrollAnimationLoopUpdateInfo>,
    reset?: boolean
  ) => {
    if (updateLoopInfo) {
      const { clampToViewport, responsiveDirectionChange, precision: precisionOption } = options;
      const { delta, getScroll } = updateLoopInfo;

      if (reset) {
        currentScroll = updateScroll = destinationScroll = destinationScrollClamped = getScroll();
        direction = overflowAmount = currentTime = updateTime = deltaTime = 0;
        directionChanged = false;
        previousTime = undefined;
      }

      const newDirection = Math.sign(delta);
      const newDirectionChanged = direction !== newDirection;
      const newOverflowAmount = osInstance.state().overflowAmount[axis];
      const rawDestinationScroll =
        (newDirectionChanged
          ? clamp(
              0,
              newOverflowAmount,
              responsiveDirectionChange ? currentScroll : destinationScroll
            )
          : destinationScroll) + delta;
      const newDestinationScrollClamped = clamp(0, newOverflowAmount, rawDestinationScroll);

      destinationScroll = clampToViewport ? newDestinationScrollClamped : rawDestinationScroll;
      destinationScrollClamped = newDestinationScrollClamped;
      overflowAmount = newOverflowAmount;
      direction = newDirection;
      directionChanged = newDirectionChanged;
      precision = createPrecisionFn(precisionOption);

      updateScroll = currentScroll;
      updateTime = currentTime;
    }

    return {
      axis,
      currentScroll,
      updateScroll,
      destinationScroll,
      destinationScrollClamped,
      overflowAmount,
      direction,
      directionChanged,
      precision,
      osInstance,
    };
  };

  const isRunning = () => typeof animationFrameId === 'number';

  const stopAnimationLoop = (canceled?: boolean) => {
    const { onAnimationCancel } = options;
    if (isRunning()) {
      canceled &&
        onAnimationCancel &&
        onAnimationCancel({
          axis,
          state: getScrollAnimationState(),
          frameInfo: getFrameInfo(),
        });
      cancelAnimationFrame(animationFrameId!);
      animationFrameId = undefined;
    }
  };

  const osDestroyed = () => {
    const { destroyed } = osInstance.state();

    if (destroyed) {
      stopAnimationLoop();
    }

    return destroyed;
  };

  return {
    update(loopUpdateInfo) {
      if (osDestroyed()) {
        return;
      }

      const { scrollAnimation } = options;
      const { update, frame } = scrollAnimation;
      const start = !isRunning();
      const animationUpdateInfo = { ...loopUpdateInfo, start, axis };

      const updateState = getScrollAnimationState(loopUpdateInfo, start);
      update && update(animationUpdateInfo, updateState);

      if (start) {
        const scrollAnimationLoopFrame: FrameRequestCallback = (frameTime) => {
          if (osDestroyed() || !options) {
            stopAnimationLoop();
            return;
          }

          const { onAnimationStart, onAnimationStop, onAnimationFrame, applyScroll } =
            options || {};

          const isStart = !previousTime;
          const frameInfo = getFrameInfo(frameTime);
          const state = getScrollAnimationState();

          isStart &&
            onAnimationStart({
              axis,
              state,
              frameInfo,
            });

          const frameResult = frame(state, frameInfo);

          const { scroll: rawResultScroll, stop: rawResultStop } = frameResult || {};

          const finalResult: ScrollAnimationFrameResult = {
            ...frameResult,
          };

          if (isNumber(rawResultScroll)) {
            // clamp the resulting scroll and set it as current scroll
            currentScroll = clamp(0, overflowAmount, rawResultScroll);
            // force precision on the resulting scroll
            finalResult.scroll = precision(currentScroll);
            // force stop on overshoot
            finalResult.stop = rawResultStop || getScrollOvershoot(rawResultScroll, overflowAmount);
          }

          const { scroll, stop } = finalResult;

          onAnimationFrame({ axis, state, frameInfo, frameResult: finalResult });

          applyScroll({
            axis,
            scroll:
              isNumber(scroll) &&
              convertScrollPosition(
                clamp(0, overflowAmount, scroll),
                overflowAmount,
                getRTLScrollBehavior(axis, osInstance)
              ),
            target: scrollOffsetElement,
          });

          if (stop) {
            onAnimationStop({ axis, state, frameInfo });
            stopAnimationLoop();
            return;
          }

          previousTime = frameTime;
          averageDeltaTime = (averageDeltaTime + deltaTime) / 2;
          animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
        };

        animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
      }
    },
    cancel: () => {
      if (osDestroyed()) {
        return;
      }

      stopAnimationLoop(true);
    },
    isRunning,
  };
};
