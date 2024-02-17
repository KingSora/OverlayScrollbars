import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimationFrameInfo } from './scrollAnimation';
import type { OverlayScrollbarsPluginSmoothOptions } from './overlayscrollbars-plugin-smooth';
import type { XY } from './utils';
import {
  clamp,
  createPrecisionFn,
  getScrollOvershoot,
  isNumber,
  newXY0,
  newXYfalse,
  perAxis,
} from './utils';

export interface ScrollAnimationLoop {
  /** Function which returns whether the scroll animation loop is running. */
  isRunning(): boolean;
  /** Starts / Updates the scroll animation loop. */
  update(
    options: Readonly<OverlayScrollbarsPluginSmoothOptions>,
    info: Readonly<ScrollAnimationLoopInfo>
  ): void;
  /** Cancels (stops) the scroll animation loop. */
  cancel(): void;
}

export interface ScrollAnimationLoopInfo {
  /** The wheel delta values in pixel. */
  delta: Readonly<XY<number>>;
  /** Function to get the current scroll values in pixel. Should be used sparingly because of possible browser reflow. */
  getScroll: () => XY<number>;
}

export const createScrollAnimationLoop = (osInstance: OverlayScrollbars): ScrollAnimationLoop => {
  let animationFrameId: ReturnType<typeof requestAnimationFrame> | undefined;
  let options: OverlayScrollbarsPluginSmoothOptions | undefined;
  let averageDeltaTime = 1000 / 60; // assume 60fps
  const currentScroll = newXY0();
  const updateScroll = newXY0();
  const destinationScroll = newXY0();
  const destinationScrollClamped = newXY0();
  const direction = newXY0();
  const directionChanged = newXYfalse();
  const overshoot = newXYfalse();
  const frameInfo: ScrollAnimationFrameInfo = {
    currentTime: 0,
    deltaTime: 0,
    startTime: 0,
  };

  const isRunning = () => typeof animationFrameId === 'number';

  const stopAnimationLoop = (canceled?: boolean) => {
    const { scrollAnimation, onAnimationCancel: onAnimationCanceled } = options || {};
    if (isRunning()) {
      canceled && scrollAnimation && onAnimationCanceled && onAnimationCanceled(frameInfo);
      cancelAnimationFrame(animationFrameId!);
    }

    frameInfo.startTime = frameInfo.currentTime = frameInfo.deltaTime = 0;
    frameInfo.previousTime = animationFrameId = options = undefined;
  };

  const updateMembers = (
    ops: Readonly<OverlayScrollbarsPluginSmoothOptions>,
    loopInfo: ScrollAnimationLoopInfo,
    reset?: boolean
  ) => {
    const { clampToViewport, responsiveDirectionChange } = ops;
    const { delta, getScroll } = loopInfo;
    const { overflowAmount } = osInstance.state();

    perAxis((axis) => {
      if (reset) {
        currentScroll[axis] =
          updateScroll[axis] =
          destinationScroll[axis] =
          destinationScrollClamped[axis] =
            getScroll()[axis];
        direction[axis] = 0;
        directionChanged[axis] = overshoot[axis] = false;
      }

      const axisDelta = delta[axis];
      const axisCurrentScroll = currentScroll[axis];
      const axisOvershoot = overshoot[axis];
      const axisOverflowAmount = overflowAmount[axis];
      const axisDirection = Math.sign(axisDelta);
      const axisDirectionChanged = direction[axis] !== axisDirection;
      const axisRawDestinationScroll =
        (axisDirectionChanged || axisOvershoot
          ? clamp(
              0,
              axisOverflowAmount,
              responsiveDirectionChange ? axisCurrentScroll : destinationScroll[axis]
            )
          : destinationScroll[axis]) + axisDelta;
      const axisClampedDestinationScroll = clamp(0, axisOverflowAmount, axisRawDestinationScroll);

      updateScroll[axis] = axisCurrentScroll;
      destinationScroll[axis] = clampToViewport
        ? axisClampedDestinationScroll
        : axisRawDestinationScroll;
      destinationScrollClamped[axis] = axisClampedDestinationScroll;
      direction[axis] = axisDirection;
      directionChanged[axis] = axisDirectionChanged;
      overshoot[axis] = axisDelta ? false : axisOvershoot;
    });
  };

  const osDestroyed = () => {
    const { destroyed } = osInstance.state();

    if (destroyed) {
      stopAnimationLoop();
    }

    return destroyed;
  };

  return {
    update(ops, info) {
      if (osDestroyed()) {
        return;
      }

      // if the scroll animation changes while a scroll animation is running, cancel the old scroll animation
      if (options && options.scrollAnimation !== ops.scrollAnimation) {
        stopAnimationLoop(true);
      }

      const { scrollAnimation, precision: precisionOption } = ops;
      const { start, update, frame } = scrollAnimation;
      const precision = createPrecisionFn(precisionOption);
      const scrollAnimationInfo = {
        ...info,
        currentScroll,
        updateScroll,
        destinationScroll,
        destinationScrollClamped,
        direction,
        directionChanged,
        precision,
      };

      if (!isRunning()) {
        const scrollAnimationLoopFrame: FrameRequestCallback = (currFrameTime) => {
          if (osDestroyed() || !options || !scrollAnimationInfo) {
            stopAnimationLoop();
            return;
          }

          const { onAnimationStart, onAnimationStop, onAnimationFrame } = options || {};
          const { startTime, previousTime } = frameInfo;

          frameInfo.currentTime = currFrameTime;
          frameInfo.deltaTime = previousTime ? currFrameTime - previousTime : averageDeltaTime;

          if (!startTime) {
            frameInfo.startTime = currFrameTime;
            onAnimationStart && onAnimationStart(frameInfo);
          }

          const frameResult = frame(scrollAnimationInfo, frameInfo, osInstance);
          const { scroll: resultScroll, stop: resultStop } = frameResult || {};
          const { overflowAmount } = osInstance.state();

          if (resultScroll) {
            perAxis((axis) => {
              const axisOverflowAmount = overflowAmount[axis];
              const axisResultScroll = resultScroll[axis];

              if (isNumber(axisResultScroll)) {
                const axisResultScrollClamped = clamp(0, axisOverflowAmount, axisResultScroll);
                const axisOvershoot = getScrollOvershoot(axisResultScroll, axisOverflowAmount);

                overshoot[axis] = axisOvershoot;
                currentScroll[axis] = axisResultScrollClamped;
                resultScroll[axis] = precision(axisResultScrollClamped);

                if (resultStop && axisOvershoot) {
                  resultStop[axis] = true;
                }
              }
            });
          }
          onAnimationFrame && onAnimationFrame(frameInfo, frameResult || undefined);

          if (resultStop && resultStop.x && resultStop.y) {
            onAnimationStop && onAnimationStop(frameInfo);
            stopAnimationLoop();
            return;
          }

          frameInfo.previousTime = currFrameTime;
          animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
          averageDeltaTime = (averageDeltaTime + frameInfo.deltaTime) / 2;
        };

        updateMembers(ops, info, true);
        start && start(scrollAnimationInfo, osInstance);
        animationFrameId = requestAnimationFrame(scrollAnimationLoopFrame);
      } else {
        updateMembers(ops, info);
        update && update(scrollAnimationInfo, osInstance);
      }

      options = ops as any;
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
