import type { ScrollAnimation } from './scrollAnimation';
import type { XY } from './utils';
import { newXY0, clamp, perAxis } from './utils';

export interface SpringScrollAnimationOptions {
  /**
   * The perceived duration of the scroll animation in milliseconds.
   * The real scroll duration can be longer or shorter.
   */
  duration: number;
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
  /** When the scroll velocity (in pixel / second) is smaller than the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
}

const defaultOptions: SpringScrollAnimationOptions = {
  duration: 333,
  bounce: -1,
  stopVelocity: 1,
};

const stopDistanceEpsilon = 0.00001; // for the case that precision is Infinite

export const springScrollAnimation = (
  options?: Partial<SpringScrollAnimationOptions>
): ScrollAnimation => {
  const {
    duration: durationOption,
    bounce,
    stopVelocity,
  } = Object.assign({}, defaultOptions, options);

  const dampingRatio = 1 - clamp(-1, 1, bounce);
  // const damping = dampingRatio * 2 * Math.sqrt(stiffness);

  let springFrequency = 0;
  let dampedSpringFrequency = 0;

  const velocity = newXY0();
  const update = () => {
    springFrequency = Math.sqrt(
      Math.pow((2 * Math.PI) / Math.abs((durationOption || 1) / 1000), 2)
    );
    dampedSpringFrequency =
      dampingRatio < 1
        ? springFrequency * Math.sqrt(1 - dampingRatio * dampingRatio)
        : springFrequency * Math.sqrt(dampingRatio * dampingRatio - 1);
  };

  return {
    start() {
      perAxis((axis) => {
        velocity[axis] = 0;
      });

      update();
    },
    update,
    frame({ currentScroll, destinationScroll, destinationScrollClamped, precision }, frameInfo) {
      const { deltaTime } = frameInfo;
      const deltaSeconds = deltaTime / 1000;
      const appliedScroll: Partial<XY<number>> = {};
      const stop: Partial<XY<boolean>> = {};

      perAxis((axis) => {
        const axisVelocity = velocity[axis];
        const axisCurrentScroll = currentScroll[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisDestinationScrollClamped = destinationScrollClamped[axis];
        const axisDistance = axisCurrentScroll - axisDestinationScroll;

        let axisNewDistance = 0;
        let axisNewVelocity = 0;

        // Critically damped
        if (dampingRatio === 1) {
          const c1 = springFrequency * axisDistance + axisVelocity;
          const c2 = axisDistance + c1 * deltaSeconds;
          const dampingExp = Math.pow(Math.E, -springFrequency * deltaSeconds);

          axisNewDistance = c2 * dampingExp;
          axisNewVelocity = c2 * dampingExp * -springFrequency + c1 * dampingExp;
        }
        // Underdamped
        else if (dampingRatio < 1) {
          const c1 = axisDistance;
          const c2 =
            (1 / dampedSpringFrequency) *
            (dampingRatio * springFrequency * axisDistance + axisVelocity);
          const dampingExp = Math.pow(Math.E, -dampingRatio * springFrequency * deltaSeconds);
          const frequencyTimeDelta = dampedSpringFrequency * deltaSeconds;
          const cos = Math.cos(frequencyTimeDelta);
          const sin = Math.sin(frequencyTimeDelta);

          axisNewDistance = dampingExp * (c1 * cos + c2 * sin);
          axisNewVelocity =
            axisNewDistance * -springFrequency * dampingRatio +
            dampingExp * (-dampedSpringFrequency * c1 * sin + dampedSpringFrequency * c2 * cos);
        }
        // Overdamped
        else {
          const r1 = -dampingRatio * springFrequency - dampedSpringFrequency;
          const r2 = -dampingRatio * springFrequency + dampedSpringFrequency;
          const c1 = axisDistance - (r1 * axisDistance - axisVelocity) / (r1 - r2);
          const c2 = (r1 * axisDistance - axisVelocity) / (r1 - r2);
          const dampingExp1 = Math.pow(Math.E, r1 * deltaSeconds);
          const dampingExp2 = Math.pow(Math.E, r2 * deltaSeconds);

          axisNewDistance = c1 * dampingExp1 + c2 * dampingExp2;
          axisNewVelocity = c1 * r1 * dampingExp1 + c2 * r2 * dampingExp2;
        }

        const axisNewScroll = axisNewDistance + axisDestinationScroll;

        velocity[axis] = axisNewVelocity;
        appliedScroll[axis] = axisNewScroll;
        stop[axis] =
          precision(Math.abs(axisDestinationScrollClamped - axisNewScroll)) < stopDistanceEpsilon &&
          Math.abs(velocity[axis]) < stopVelocity;
      });

      return {
        stop,
        scroll: appliedScroll,
      };
    },
  };
};
