import type { ScrollAnimation } from './scrollAnimation';
import type { XY } from './utils';
import { newXY0, clamp, perAxis, isNumber } from './utils';

export interface SpringScrollAnimationOptions {
  /** The spring properties which describe the animation. */
  spring: DurationSpring | PhysicalSpring;
  /** When the scroll velocity (in pixel / second) is smaller than the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
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
    bounce: 0.9,
  },
  stopVelocity: 1,
};

const stopDistanceEpsilon = 0.00001; // for the case that precision is Infinite

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
  const { spring, stopVelocity } = Object.assign({}, defaultOptions, options);

  if (!spring) {
    throw new Error();
  }

  const { mass, damping, stiffness } = getPhysicalSpring(spring);

  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const lambda = damping / mass / 2;
  const natFreq = Math.sqrt(stiffness / mass);
  const natFreqDamped = natFreq * Math.sqrt(Math.abs(1 - dampingRatio * dampingRatio));
  const natFreqCoeff = -natFreq * dampingRatio;

  const velocity = newXY0();

  return {
    start() {
      perAxis((axis) => {
        velocity[axis] = 0;
      });
    },
    frame({ currentScroll, destinationScroll, destinationScrollClamped, precision }, frameInfo) {
      const { deltaTime } = frameInfo;
      const deltaSeconds = deltaTime / 1000;
      const stop: Partial<XY<boolean>> = {};
      const scroll: Partial<XY<number>> = {};

      perAxis((axis) => {
        const axisVelocity = velocity[axis];
        const axisCurrentScroll = currentScroll[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisDestinationScrollClamped = destinationScrollClamped[axis];
        const axisDistance = axisCurrentScroll - axisDestinationScroll;

        let axisNewDistance = 0;
        let axisNewVelocity = 0;

        const expDelta = Math.exp(-lambda * deltaSeconds);
        const natFreqDampedDelta = natFreqDamped * deltaSeconds;

        // Critically damped
        if (dampingRatio === 1) {
          const c1 = axisDistance;
          const c2 = axisVelocity + lambda * axisDistance;

          axisNewDistance = expDelta * (c1 + c2 * deltaSeconds);
          axisNewVelocity = (c1 + c2 * deltaSeconds) * expDelta * -lambda + c2 * expDelta;
        }
        // Underdamped
        else if (dampingRatio < 1) {
          const c1 = axisDistance;
          const c2 = (axisVelocity + lambda * axisDistance) / natFreqDamped;
          const sin = Math.sin(natFreqDampedDelta);
          const cos = Math.cos(natFreqDampedDelta);

          axisNewDistance = expDelta * (c1 * cos + c2 * sin);
          axisNewVelocity =
            axisNewDistance * natFreqCoeff +
            expDelta * (-natFreqDamped * c1 * sin + natFreqDamped * c2 * cos);
        }
        // Overdamped
        else {
          const c1 = (axisVelocity + axisDistance * (lambda + natFreqDamped)) / (2 * natFreqDamped);
          const c2 = axisDistance - c1;
          const ex1 = Math.exp(natFreqDampedDelta);
          const ex2 = Math.exp(-natFreqDampedDelta);

          axisNewDistance = expDelta * (c1 * ex1 + c2 * ex2);
          axisNewVelocity =
            expDelta *
            (c1 * (natFreqCoeff + natFreqDamped) * ex1 + c2 * (natFreqCoeff - natFreqDamped) * ex2);
        }

        const axisNewScroll = axisNewDistance + axisDestinationScroll;

        velocity[axis] = axisNewVelocity;
        scroll[axis] = axisNewScroll;
        stop[axis] =
          precision(Math.abs(axisDestinationScrollClamped - axisNewScroll)) < stopDistanceEpsilon &&
          Math.abs(velocity[axis]) < stopVelocity;
      });

      return {
        stop,
        scroll,
      };
    },
  };
};
