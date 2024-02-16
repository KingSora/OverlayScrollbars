import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import type { XY } from './utils';
import { newXY0, clamp, lerp, perAxis, createWithPrecision, getScrollOvershoot } from './utils';

export interface EasignScrollAnimationOptions {
  /** The duration of the scroll animation in milliseconds. Can also be a function which receives the scrolled delta value as its argument. */
  duration: number | ((scrollDelta: number) => number);
  /** The easign function used when the destination scroll position changed since the beginning of the animation. */
  easingOut: EasingFn;
  /**
   * The easing function used as long as the destination scroll position is unchanged.
   * When not defined the `easingOut` function is used instead.
   */
  easingInOut?: EasingFn;
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

/**
 * An Easign function.
 * @param percent The percent (0..1) of the animation.
 * @param duration The duration of the animation.
 * @param from The start value of the animation.
 * @param to The end value of the animation.
 * @returns The "eased" percent (0..1) of the animation
 */
export type EasingFn = (percent: number, duration: number, from: number, to: number) => number;

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
    duration: durationOption,
    easingInOut,
    easingOut,
    precision,
    responsiveDirectionChange,
    clampToViewport,
  } = Object.assign({}, defaultOptions, options);

  const withPrecision = createWithPrecision(precision);
  const getDuration = (delta: number) =>
    typeof durationOption === 'function' ? durationOption(delta) : durationOption;

  let currTime = 0;
  let easing = easingOut;

  const startTime = newXY0();
  const startScroll = newXY0();
  const destinationScroll = newXY0();
  const currentScroll = newXY0();
  const destinationDirection = newXY0();
  const duration = newXY0();
  const overshoot = newXY0() as XY<number | boolean>;

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
      overshoot[axis] = axisDelta ? 0 : overshoot[axis];
      duration[axis] = axisDelta ? getDuration(axisDelta) : 0;
    });
  };

  return {
    start(animationInfo, osInstance) {
      perAxis((axis) => {
        currTime = overshoot[axis] = startTime[axis] = 0;
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
      const appliedScroll: Partial<XY<number>> = {};

      currTime += deltaTime;

      let stop = true;
      perAxis((axis) => {
        // can only happen if one axis is overshooting and the other isn't
        if (overshoot[axis]) {
          return;
        }

        const axisStartTime = startTime[axis];
        const axisDeltaDuration = duration[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisOverflowAmount = overflowAmount[axis];
        const axisClampedDestinationScroll = clamp(0, axisOverflowAmount, axisDestinationScroll);

        const axisFrom = startScroll[axis];
        const axisTo = clampToViewport ? axisClampedDestinationScroll : axisDestinationScroll;
        const axisPercent =
          axisFrom === axisTo || !axisDeltaDuration
            ? 1
            : clamp(0, 1, (currTime - axisStartTime) / axisDeltaDuration || 0);
        const axisNewScroll = lerp(
          axisFrom,
          axisTo,
          easing(axisPercent, axisDeltaDuration, axisFrom, axisTo)
        );
        const axisAppliedScroll = withPrecision(clamp(0, axisOverflowAmount, axisNewScroll));
        const axisOvershoot = getScrollOvershoot(axisNewScroll, axisOverflowAmount);

        overshoot[axis] = axisOvershoot;
        currentScroll[axis] = axisNewScroll;
        appliedScroll[axis] = axisAppliedScroll;

        stop =
          stop &&
          (currTime >= axisStartTime + axisDeltaDuration || axisPercent === 1 || axisOvershoot);
      });

      return {
        stop,
        scroll: appliedScroll,
      };
    },
  };
};
