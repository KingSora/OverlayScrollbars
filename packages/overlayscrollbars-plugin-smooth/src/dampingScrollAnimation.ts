import type { ScrollAnimation } from './scrollAnimation';
import type { XY } from './utils';
import { clamp, damp, perAxis } from './utils';

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
  const { damping, stopVelocity } = Object.assign({}, defaultOptions, options);

  return {
    frame(
      { currentScroll, destinationScroll, destinationScrollClamped, precision },
      frameInfo,
      osInstance
    ) {
      const { deltaTime } = frameInfo;
      const frameDeltaSeconds = deltaTime / 1000;
      const { overflowAmount } = osInstance.state();
      const stop: Partial<XY<boolean>> = {};
      const scroll: Partial<XY<number>> = {};

      perAxis((axis) => {
        const axisOverflowAmount = overflowAmount[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisDestinationScrollClamped = destinationScrollClamped[axis];
        const axisNewScroll = clamp(
          0,
          axisOverflowAmount,
          damp(currentScroll[axis], axisDestinationScroll, damping, frameDeltaSeconds)
        );
        const axisDistance = precision(axisDestinationScrollClamped - axisNewScroll);
        const direction = Math.sign(axisDistance);
        const velocity = Math.abs(axisDistance) / frameDeltaSeconds;

        scroll[axis] = axisNewScroll;
        stop[axis] = velocity <= stopVelocity || !direction;
      });

      return {
        stop,
        scroll,
      };
    },
  };
};
