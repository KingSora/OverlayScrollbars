import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import { newXY0, clamp, lerp, perAxis, createWithPrecision } from './utils';

export interface EasignScrollAnimationOptions {
  /** The duration of the scroll animation. Can also be a function which receives the delta value as its argument. */
  duration: number | ((delta: number) => number);
  /** The easign function used when the destination scroll position changed since the beginning of the animation. */
  easingOut: (percent: number) => number;
  /**
   * The easing function used as long as the destination scroll position is unchanged.
   * When not defined the `easingOut` function is used instead.
   */
  easingInOut?: (percent: number) => number;
  /** The fractional precision of the scroll position numbers. Can be Infinity. Negative precision is interpreted as Infinity. */
  precision: number;
  /** Whether scroll direction changes are applied instantly instead of animated. */
  responsiveDirectionChange: boolean;
  /**
   * Whether the destination scroll position is always clamped to the viewport edges.
   * Enabling this will cause the velocity to always drop near the viewport edges which causes the animation to feel smoother but less responsive near the edges.
   */
  clampToViewport: boolean;
}

const defaultOptions: EasignScrollAnimationOptions = {
  duration: 222,
  // easeInOutSine
  easingInOut: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  // easeOutSine
  easingOut: (x) => Math.sin((x * Math.PI) / 2),
  precision: 0,
  responsiveDirectionChange: true,
  clampToViewport: false,
};

export const easingScrollAnimation = (
  options?: Partial<EasignScrollAnimationOptions>
): ScrollAnimation => {
  const {
    duration,
    easingInOut,
    easingOut,
    precision,
    responsiveDirectionChange,
    clampToViewport,
  } = Object.assign({}, defaultOptions, options);

  const withPrecision = createWithPrecision(precision);
  const getDuration = (delta: number) =>
    typeof duration === 'function' ? duration(delta) : duration;

  let currTime = 0;
  let easing = easingOut;

  const startTime = newXY0();
  const deltaDuration = newXY0();
  const startScroll = newXY0();
  const destinationScroll = newXY0();
  const currentScroll = newXY0();
  const destinationDirection = newXY0();

  const updateAnimationInfo = (
    { delta }: Readonly<ScrollAnimationInfo>,
    osInstance: OverlayScrollbars
  ) => {
    const { overflowAmount } = osInstance.state();
    perAxis((axis) => {
      const axisDelta = delta[axis];
      const axisNewDestinationDirection = Math.sign(axisDelta);
      const axisDestinationDirectionChanged =
        destinationDirection[axis] !== axisNewDestinationDirection;

      destinationDirection[axis] = axisNewDestinationDirection;
      startTime[axis] = axisDelta ? currTime : startTime[axis];
      startScroll[axis] = currentScroll[axis];
      destinationScroll[axis] =
        (axisDestinationDirectionChanged
          ? clamp(
              0,
              overflowAmount[axis],
              responsiveDirectionChange ? currentScroll[axis] : destinationScroll[axis]
            )
          : destinationScroll[axis]) + axisDelta;
      deltaDuration[axis] = getDuration(axisDelta);
    });
  };

  return {
    start(animationInfo, osInstance) {
      perAxis((axis) => {
        currTime = startTime[axis] = 0;
        startScroll[axis] =
          currentScroll[axis] =
          destinationScroll[axis] =
            animationInfo.getScroll()[axis];
      });

      updateAnimationInfo(animationInfo, osInstance);
      easing = easingInOut || easingOut;
    },
    update(animationInfo, osInstance) {
      updateAnimationInfo(animationInfo, osInstance);
      easing = easingOut;
    },
    frame(_, frameInfo, osInstance) {
      const { deltaTime } = frameInfo;
      const { overflowAmount } = osInstance.state();

      currTime += deltaTime;

      let finished = true;
      let viewportEdgeReached = true;
      const precisionScroll = newXY0();
      perAxis((axis) => {
        const axisStartTime = startTime[axis];
        const axisDeltaDuration = deltaDuration[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisOverflowAmount = overflowAmount[axis];
        const axisClampedDestinationScroll = clamp(0, axisOverflowAmount, axisDestinationScroll);

        const axisPercent = clamp(0, 1, (currTime - axisStartTime) / axisDeltaDuration || 0);
        const axisNewScroll = clamp(
          0,
          axisOverflowAmount,
          lerp(
            startScroll[axis],
            clampToViewport ? axisClampedDestinationScroll : axisDestinationScroll,
            easing(axisPercent)
          )
        );
        const axisPrecisionScroll = withPrecision(axisNewScroll);

        currentScroll[axis] = axisNewScroll;
        precisionScroll[axis] = axisPrecisionScroll;
        finished = finished && (currTime >= axisStartTime + axisDeltaDuration || axisPercent === 1);
        viewportEdgeReached =
          viewportEdgeReached &&
          (axisPrecisionScroll <= 0 || axisPrecisionScroll >= axisOverflowAmount);
      });

      return {
        stop: finished || viewportEdgeReached,
        scroll: precisionScroll,
      };
    },
  };
};
