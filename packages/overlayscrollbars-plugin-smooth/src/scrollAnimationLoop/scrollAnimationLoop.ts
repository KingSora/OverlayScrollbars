import type {
  ScrollAnimationState,
  ScrollAnimation,
  ScrollAnimationFrameInfo,
  ScrollAnimationFrameResult,
} from '../scrollAnimations/scrollAnimation';
import type { Axis, AxisInfo } from '../utils';
import { clamp, createPrecisionFn, isNumber, noop } from '../utils';

export interface ScrollAnimationLoop {
  /** Function which returns whether the scroll animation loop is running. */
  isRunning(): boolean;
  /** Starts / Updates the scroll animation loop. */
  update(info: Readonly<ScrollAnimationLoopUpdateInfo>): void;
  /** Cancels (stops) the scroll animation loop. */
  cancel(): void;
  /** The current state of the animation loop. */
  state(): ScrollAnimationState;
}

export interface ScrollAnimationLoopUpdateInfo {
  /** The scroll animation. */
  scrollAnimation: ScrollAnimation | null;
  /** The scroll delta in pixel. */
  delta: number;
  /** The overflow amount in pixel */
  overflowAmount: number;
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
  /** Function to get the current scroll value in pixel. Should be used sparingly because of possible browser reflow. */
  getScroll: () => number;
  /** Function which applies the new scroll. */
  applyScroll: (newScroll?: number | false) => void;
  /** Callback when the scroll animation loop starts. */
  onAnimationStart: (animationInfo: AnimationInfo) => void;
  /** Callback when the scroll animation loop stops. */
  onAnimationStop: (animationInfo: AnimationStopInfo) => void;
  /** Callback when the scroll animation loop finished a frame. */
  onAnimationFrame: (frameInfo: AnimationFrameInfo) => void;
}

export interface ApplyScrollInfo extends AxisInfo {
  /** The scroll position to apply. If a scroll position equals `false` there was no change to the scroll position. */
  scroll: number | false;
  /** The element to which the scroll positions should be applied to. */
  target: HTMLElement;
}

export interface OverscrollInfo extends AxisInfo {
  /** Whether there is any overscroll. */
  overscroll: boolean;
  /** Whether there is a "start" overscroll. */
  start: boolean;
  /** Whether there is a "end" overscroll. */
  end: boolean;
}

export interface AnimationInfo extends AxisInfo {
  /** The state of the animation. */
  state: ScrollAnimationState;
  /** The frame info. */
  frameInfo: ScrollAnimationFrameInfo;
}

export interface AnimationStopInfo extends AnimationInfo {
  /** Whether the animation was canceled */
  canceled?: boolean;
}

export interface AnimationFrameInfo extends AnimationInfo {
  /** The frame result. */
  frameResult: ScrollAnimationFrameResult;
}

export const createScrollAnimationLoop = (axis: Axis): ScrollAnimationLoop => {
  let averageDeltaTime = 1000 / 60; // assume 60fps
  let animationFrameId: ReturnType<typeof requestAnimationFrame> | undefined;
  let scroll = 0;
  let velocity = 0;
  let scrollDelta = 0;
  let updateScroll = 0;
  let overflowAmount = 0;
  let destinationScroll = 0;
  let direction = 0;
  let directionChanged = false;
  let currentTime = 0;
  let deltaTime = 0;
  let updateTime = 0;
  let previousTime: number | undefined;
  let scrollAnimation: ScrollAnimation | null = null;
  let precision = (v: number) => v;
  let applyScroll: ScrollAnimationLoopUpdateInfo['applyScroll'] = noop;
  let onAnimationStart: ScrollAnimationLoopUpdateInfo['onAnimationStart'] = noop;
  let onAnimationStop: ScrollAnimationLoopUpdateInfo['onAnimationStop'] = noop;
  let onAnimationFrame: ScrollAnimationLoopUpdateInfo['onAnimationFrame'] = noop;

  const getFrameInfo = (frameTime?: number) => {
    if (frameTime) {
      const avgDeltaTime = frameTime ? averageDeltaTime : 0;
      currentTime = frameTime;
      deltaTime = previousTime ? frameTime - previousTime : avgDeltaTime;
      updateTime = updateTime || currentTime;
    }

    return {
      currentTime,
      deltaTime,
      updateTime,
      previousTime,
    };
  };

  const resetScrollAnimationState = (scrollPosition: number) => {
    scroll = updateScroll = destinationScroll = scrollPosition;
    velocity = direction = scrollDelta = overflowAmount = currentTime = updateTime = deltaTime = 0;
    directionChanged = false;
    animationFrameId = previousTime = undefined;
  };

  const getScrollAnimationState = (
    info?: Readonly<ScrollAnimationLoopUpdateInfo>,
    reset?: boolean
  ): ScrollAnimationState => {
    if (info) {
      const {
        delta,
        clampToViewport,
        responsiveDirectionChange,
        precision: precisionNumber,
        overflowAmount: newOverflowAmount,
        scrollAnimation: newScrollAnimation,
        applyScroll: newApplyScroll,
        onAnimationStart: newOnAnimationStart,
        onAnimationStop: newOnAnimationStop,
        onAnimationFrame: newOnAnimationFrame,
        getScroll,
      } = info;

      reset && resetScrollAnimationState(getScroll());

      const finiteNonNaNDelta = isFinite(delta) && !isNaN(delta) ? delta : 0;
      const newDirection = finiteNonNaNDelta ? Math.sign(finiteNonNaNDelta) : direction; // without delta continue with the current direction
      const newDirectionChanged = direction !== newDirection;
      const rawDestinationScroll =
        (newDirectionChanged
          ? clamp(0, newOverflowAmount, responsiveDirectionChange ? scroll : destinationScroll)
          : destinationScroll) + finiteNonNaNDelta;
      const newDestinationScrollClamped = clamp(0, newOverflowAmount, rawDestinationScroll);

      destinationScroll = clampToViewport ? newDestinationScrollClamped : rawDestinationScroll;
      overflowAmount = newOverflowAmount;
      direction = newDirection;
      directionChanged = newDirectionChanged;
      scrollAnimation = newScrollAnimation;
      precision = createPrecisionFn(precisionNumber);
      applyScroll = newApplyScroll;
      onAnimationStart = newOnAnimationStart;
      onAnimationStop = newOnAnimationStop;
      onAnimationFrame = newOnAnimationFrame;

      scrollDelta = destinationScroll - scroll;
      updateScroll = scroll;
      updateTime = currentTime;
    }

    return {
      axis,
      scroll,
      velocity,
      scrollDelta,
      updateScroll,
      destinationScroll,
      overflowAmount,
      direction,
      directionChanged,
      precision,
    };
  };

  const isRunning = () => typeof animationFrameId === 'number';

  const stopAnimationLoop = (canceled?: boolean) => {
    if (isRunning()) {
      onAnimationStop({
        axis,
        state: getScrollAnimationState(),
        frameInfo: getFrameInfo(),
        canceled,
      });
      cancelAnimationFrame(animationFrameId!);
      animationFrameId = undefined;
    }
    resetScrollAnimationState(0);
  };

  return {
    update(info) {
      const start = !isRunning();
      const animationUpdateInfo = { ...info, start, axis };
      const updateState = getScrollAnimationState(info, start);

      const { update, frame } = scrollAnimation || {};
      update && update(animationUpdateInfo, updateState);

      if (start) {
        const scrollAnimationLoopFrame: FrameRequestCallback = (frameTime) => {
          const isStart = !previousTime;
          const frameInfo = getFrameInfo(frameTime);
          const state = getScrollAnimationState();

          isStart &&
            onAnimationStart({
              axis,
              state,
              frameInfo,
            });

          const rawFrameResult = frame
            ? frame(state, frameInfo)
            : { stop: true, scroll: destinationScroll };
          const {
            scroll: rawResultScroll,
            velocity: rawResultVelocity,
            stop: rawResultStop,
          } = rawFrameResult || {};

          const frameResult: ScrollAnimationFrameResult = {
            ...rawFrameResult,
          };

          if (isNumber(rawResultScroll)) {
            const overscroll = rawResultScroll < 0 || rawResultScroll > overflowAmount;

            // clamp the resulting scroll and set it as current scroll
            scroll = clamp(0, overflowAmount, rawResultScroll);
            scrollDelta = destinationScroll - scroll;

            // force precision on the resulting scroll
            frameResult.scroll = precision(scroll);
            // force stop on overshoot
            frameResult.stop = rawResultStop || overscroll;
          }

          if (isNumber(rawResultVelocity)) {
            velocity = rawResultVelocity;
          }

          onAnimationFrame({ axis, state, frameInfo, frameResult });
          applyScroll(frameResult.scroll);

          if (frameResult.stop) {
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
    cancel() {
      stopAnimationLoop(true);
    },
    isRunning,
    state: () => getScrollAnimationState(),
  };
};