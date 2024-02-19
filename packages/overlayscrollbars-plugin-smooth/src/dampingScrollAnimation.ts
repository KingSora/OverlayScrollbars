import type { ScrollAnimation } from './scrollAnimation';
import { damp } from './utils';

export interface DampingScrollAnimationOptions {
  /**
   * Damping rate between 0..1. (The proportion of scroll distance remaining after one second.)
   * 0 = no damping, the destination scroll offset is reached instantly.
   * 1 = infinite damping, the destination scroll offset is never reached.
   */
  damping: number;
  /** When the scroll velocity (in pixel / second) is smaller or equal to the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
}

const defaultOptions: DampingScrollAnimationOptions = {
  damping: 0.0033,
  stopVelocity: 1,
};

export const dampingScrollAnimation = (
  options?: Partial<DampingScrollAnimationOptions>
): ScrollAnimation => {
  const { damping, stopVelocity } = { ...defaultOptions, ...options };

  return {
    frame(
      { currentScroll, destinationScroll, destinationScrollClamped, precision },
      { deltaTime }
    ) {
      const deltaSeconds = deltaTime / 1000;
      const scroll = damp(currentScroll, destinationScroll, damping, deltaSeconds);
      const axisDistance = precision(destinationScrollClamped - scroll);
      const direction = Math.sign(axisDistance);
      const velocity = Math.abs(axisDistance) / deltaSeconds;

      return {
        stop: velocity <= stopVelocity || !direction,
        scroll,
      };
    },
  };
};
