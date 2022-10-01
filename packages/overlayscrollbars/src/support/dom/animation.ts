import { rAF, cAF } from '~/support/compatibility';
import { isFunction } from '~/support/utils';

const { max } = Math;
const animationCurrentTime = () => performance.now();

/**
 * percent: current percent (0 - 1),
 * time: current time (duration * percent),
 * min: start value
 * max: end value
 * duration: duration in ms
 */
export type EasingFn = (
  percent: number,
  time: number,
  min: number,
  max: number,
  duration: number
) => number;

export const animateNumber = (
  from: number,
  to: number,
  duration: number,
  onFrame: (progress: number, percent: number, completed: boolean) => any,
  easing?: EasingFn | false
): ((complete?: boolean) => void) => {
  let animationFrameId = 0;
  const timeStart = animationCurrentTime();
  const finalDuration = Math.max(0, duration);
  const frame = (complete?: boolean) => {
    const timeNow = animationCurrentTime();
    const timeElapsed = timeNow - timeStart;
    const stopAnimation = timeElapsed >= finalDuration;
    const percent = complete
      ? 1
      : 1 - (max(0, timeStart + finalDuration - timeNow) / finalDuration || 0);
    const progress =
      (to - from) *
        (isFunction(easing)
          ? easing(percent, percent * finalDuration, 0, 1, finalDuration)
          : percent) +
      from;
    const animationCompleted = stopAnimation || percent === 1;

    onFrame && onFrame(progress, percent, animationCompleted);

    animationFrameId = animationCompleted ? 0 : rAF!(() => frame());
  };
  frame();
  return (complete) => {
    cAF!(animationFrameId);
    complete && frame(complete);
  };
};
