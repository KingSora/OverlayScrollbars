import type { ScrollAnimation } from './scrollAnimation';
import { newXY0, clamp, lerp } from '../utils';

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

  const easing = {
    x: easingOut,
    y: easingOut,
  };
  const duration = newXY0();

  return {
    update({ axis, delta, start }) {
      duration[axis] = delta ? getDuration(delta) : 0;
      easing[axis] = start ? easingInOut || easingOut : easingOut;
    },
    frame({ axis, updateScroll, destinationScroll }, { updateTime, currentTime }) {
      const currentDuration = duration[axis];
      const elapsedTimeSinceUpdate = currentTime - updateTime;
      const percent =
        updateScroll === destinationScroll || !currentDuration
          ? 1
          : clamp(0, 1, elapsedTimeSinceUpdate / currentDuration || 0);
      const scroll = lerp(
        updateScroll,
        destinationScroll,
        easing[axis](percent, currentDuration, updateScroll, destinationScroll)
      );

      const stop = elapsedTimeSinceUpdate >= updateTime + currentDuration || percent === 1;

      return {
        stop,
        scroll,
      };
    },
  };
};
