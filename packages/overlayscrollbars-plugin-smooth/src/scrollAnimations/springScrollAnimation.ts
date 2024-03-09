import { springSimulation } from '~/simulations/springSimulation';
import type { ScrollAnimation } from './scrollAnimation';
import { clamp, isNumber } from '../utils';
import { stopDistanceEpsilon, stopVelocityEpsilon } from './constants';

export interface SpringScrollAnimationOptions {
  /** The spring properties which describe the animation. */
  spring: DurationSpring | PhysicalSpring;
  /** When the scroll velocity (in pixel / seconds) is smaller than the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
  /** When the distance to the destination scroll position is smaller than the `stopDistance` the animation will stop even before the destination scroll position is reached. */
  stopDistance: number;
}

export interface PhysicalSpring {
  /**
   * The mass attached to the spring in kilograms. Must be a number greater than 0.
   * The higher the mass, the longer it takes for the scroll destination to be reached.
   */
  mass: number;
  /**
   * The stiffness of the spring in kilograms per second squared. Must be a number greater than 0.
   * If the stiffness is high, the spring will contract more powerfully and the scroll animation will feel snappy.
   */
  stiffness: number;
  /**
   * The damping of the spring in kilograms per second. Must be a positive number or 0.
   * The higher the damping, the slower the scroll animation will be. If the damping is low enough it will create a bouncy effect.
   */
  damping: number;
}

export interface DurationSpring {
  /**
   * The perceived duration of the scroll animation in milliseconds.
   * The real scroll duration can be longer or shorter.
   */
  perceivedDuration: number;
  /**
   * The bounciness of the animation in the range -1..1.
   * If bounce is < 0 the animation is "flattened" (the spring is "underdamped").
   * If bounce is 0 the animation is "smooth" (the spring is "critically damped").
   * If bounce is > 0 the animation is "bouncy" (the spring is "underdamped").
   * With `-1` the destination scroll position is reached the slowest.
   * With `0` the destination scroll position is reached the fastest.
   * With `1` the animation will oscillate forever and the destination scroll position is never reached.
   */
  bounce: number;
}

const defaultOptions: SpringScrollAnimationOptions = {
  spring: {
    perceivedDuration: 333,
    bounce: -1,
  },
  stopVelocity: 1,
  stopDistance: 1,
};

const getPhysicalSpring = (spring: PhysicalSpring | DurationSpring): PhysicalSpring => {
  if (isNumber((spring as DurationSpring).bounce)) {
    const { perceivedDuration, bounce } = spring as DurationSpring;
    const durationSeconds = Math.abs((perceivedDuration || 1) / 1000);
    const dampingRatio = 1 - clamp(-1, 1, bounce);
    const mass = 1;

    return {
      mass,
      stiffness: Math.pow((2 * Math.PI) / durationSeconds, 2) * mass,
      damping: (4 * Math.PI * dampingRatio * mass) / durationSeconds,
    };
  }

  return spring as PhysicalSpring;
};

export const springScrollAnimation = (
  options?: Partial<SpringScrollAnimationOptions>
): ScrollAnimation => {
  const { spring, stopVelocity, stopDistance } = { ...defaultOptions, ...options };
  const { mass, damping, stiffness } = getPhysicalSpring(spring);
  const simulation = springSimulation({
    _mass: mass,
    _stiffness: stiffness,
    _damping: damping,
  });

  return {
    frame({ scroll, velocity, destinationScroll }, { deltaTime }) {
      const { _displacement, _velocity } = simulation.simulate(
        destinationScroll - scroll,
        velocity,
        deltaTime / 1000
      );
      const newScroll = scroll + _displacement;

      return {
        stop:
          Math.abs(_velocity) < Math.max(stopVelocityEpsilon, stopVelocity) &&
          Math.abs(destinationScroll - newScroll) < Math.max(stopDistanceEpsilon, stopDistance),
        scroll: newScroll,
        velocity: _velocity,
      };
    },
  };
};
