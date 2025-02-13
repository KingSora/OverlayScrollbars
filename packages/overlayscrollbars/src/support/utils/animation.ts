import { mathMax, rAF, cAF } from './alias';
import { isFunction } from './types';

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

const animationCurrentTime = () => performance.now();

export const animateNumber = (
  from: number,
  to: number,
  duration: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFrame: (progress: number, percent: number, completed: boolean) => any,
  easing?: EasingFn | false
): ((complete?: boolean) => void) => {
  let animationFrameId = 0;
  const timeStart = animationCurrentTime();
  const finalDuration = mathMax(0, duration);
  const frame = (complete?: boolean) => {
    const timeNow = animationCurrentTime();
    const timeElapsed = timeNow - timeStart;
    const stopAnimation = timeElapsed >= finalDuration;
    const percent = complete
      ? 1
      : 1 - (mathMax(0, timeStart + finalDuration - timeNow) / finalDuration || 0);
    const progress =
      (to - from) *
        (isFunction(easing)
          ? easing(percent, percent * finalDuration, 0, 1, finalDuration)
          : percent) +
      from;
    const animationCompleted = stopAnimation || percent === 1;

    if (onFrame) {
      onFrame(progress, percent, animationCompleted);
    }

    animationFrameId = animationCompleted ? 0 : rAF!(() => frame());
  };
  frame();
  return (complete) => {
    cAF!(animationFrameId);
    if (complete) {
      frame(complete);
    }
  };
};
