import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import type { XY } from './utils';
import { newXY0, clamp, lerp, perAxis } from './utils';

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
};

export const easingScrollAnimation = (
  options?: Partial<EasignScrollAnimationOptions>
): ScrollAnimation => {
  const {
    duration: durationOption,
    easingInOut,
    easingOut,
  } = Object.assign({}, defaultOptions, options);

  const getDuration = (delta: number) =>
    typeof durationOption === 'function' ? durationOption(delta) : durationOption;

  let currTime = 0;
  let easing = easingOut;

  const startTime = newXY0();
  const duration = newXY0();

  const updateAnimationInfo = ({ delta }: Readonly<ScrollAnimationInfo>) => {
    perAxis((axis) => {
      const axisDelta = delta[axis];
      startTime[axis] = axisDelta ? currTime : startTime[axis];
      duration[axis] = axisDelta ? getDuration(axisDelta) : 0;
    });
  };

  return {
    start(info) {
      perAxis((axis) => {
        currTime = startTime[axis] = 0;
      });

      updateAnimationInfo(info);
      easing = easingInOut || easingOut;
    },
    update(info) {
      updateAnimationInfo(info);
      easing = easingOut;
    },
    frame({ updateScroll, destinationScroll }, frameInfo) {
      const { deltaTime } = frameInfo;
      const appliedScroll: Partial<XY<number>> = {};
      const stop: Partial<XY<boolean>> = {};

      currTime += deltaTime;

      perAxis((axis) => {
        const axisStartTime = startTime[axis];
        const axisDeltaDuration = duration[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisFrom = updateScroll[axis];
        const axisTo = axisDestinationScroll;

        const axisPercent =
          axisFrom === axisTo || !axisDeltaDuration
            ? 1
            : clamp(0, 1, (currTime - axisStartTime) / axisDeltaDuration || 0);
        const axisNewScroll = lerp(
          axisFrom,
          axisTo,
          easing(axisPercent, axisDeltaDuration, axisFrom, axisTo)
        );

        appliedScroll[axis] = axisNewScroll;
        stop[axis] = currTime >= axisStartTime + axisDeltaDuration || axisPercent === 1;
      });

      return {
        stop,
        scroll: appliedScroll,
      };
    },
  };
};
