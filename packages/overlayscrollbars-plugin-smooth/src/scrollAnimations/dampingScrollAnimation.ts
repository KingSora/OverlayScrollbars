import { dampingSimulation } from '~/simulations/dampingSimulation';
import type { ScrollAnimation } from '../scrollAnimations/scrollAnimation';
import { stopDistanceEpsilon, stopVelocityEpsilon } from './constants';

export interface DampingScrollAnimationOptions {
  /**
   * Damping rate between 0..1. (The proportion of scroll distance remaining after one second.)
   * 0 = no damping, the destination scroll offset is reached instantly.
   * 1 = infinite damping, the destination scroll offset is never reached.
   */
  damping: number;
  /** When the scroll velocity (in pixel / seconds) is smaller than the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
  /** When the distance to the destination scroll position is smaller than the `stopDistance` the animation will stop even before the destination scroll position is reached. */
  stopDistance: number;
}

const defaultOptions: DampingScrollAnimationOptions = {
  damping: 0.0033,
  stopVelocity: 1,
  stopDistance: 0,
};

export const dampingScrollAnimation = (
  options?: Partial<DampingScrollAnimationOptions>
): ScrollAnimation => {
  const { damping, stopVelocity, stopDistance } = { ...defaultOptions, ...options };

  const simulation = dampingSimulation({ _damping: damping });

  return {
    /*
    update(updateInfo) {
      const velocity = updateInfo.delta * Math.log(damping);
      const duration = (Math.log(stopVelocity / Math.abs(velocity)) / Math.log(damping)) * 1000;

      console.log({ vel: velocity, duration });
    },
*/
    frame({ scroll, destinationScroll }, { deltaTime }) {
      const { _displacement, _velocity } = simulation.simulate(
        destinationScroll - scroll,
        0,
        deltaTime / 1000
      );
      const newScroll = scroll + _displacement;

      return {
        stop:
          Math.abs(_velocity) < Math.max(stopVelocityEpsilon, stopVelocity) ||
          Math.abs(destinationScroll - newScroll) < Math.max(stopDistanceEpsilon, stopDistance),
        scroll: newScroll,
        velocity: _velocity,
      };
    },
  };
};
