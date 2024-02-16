import type { OverlayScrollbars } from 'overlayscrollbars';
import type { ScrollAnimation, ScrollAnimationInfo } from './scrollAnimation';
import type { XY } from './utils';
import { newXY0, clamp, perAxis, createWithPrecision, getScrollOvershoot } from './utils';

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
  /** The fractional precision of the scroll position numbers. Can be Infinity. Negative precision is interpreted as Infinity. */
  precision: number;
  /** Whether scroll direction changes are applied instantly instead of animated. */
  responsiveDirectionChange: boolean;
  /**
   * Whether the destination scroll position is always clamped to the viewport edges.
   * Enabling this will cause the velocity to always drop near the viewport edges which causes the animation to feel smoother but less responsive near the edges.
   */
  clampToViewport: boolean;
  /** When the scroll velocity (in pixel / second) is smaller than the `stopVelocity` the animation will stop even before the destination scroll position is reached. */
  stopVelocity: number;
}

const defaultOptions: SpringScrollAnimationOptions = {
  duration: 333,
  bounce: -1,
  precision: 0,
  responsiveDirectionChange: true,
  clampToViewport: false,
  stopVelocity: 1,
};

const stopDistanceEpsilon = 0.00001; // for the case that precision is Infinite

export const springScrollAnimation = (
  options?: Partial<SpringScrollAnimationOptions>
): ScrollAnimation => {
  const {
    duration: durationOption,
    bounce,
    responsiveDirectionChange,
    clampToViewport,
    stopVelocity,
    precision,
  } = Object.assign({}, defaultOptions, options);

  const withPrecision = createWithPrecision(precision);

  const dampingRatio = 1 - clamp(-1, 1, bounce);
  // const damping = dampingRatio * 2 * Math.sqrt(stiffness);

  let springFrequency = 0;
  let dampedSpringFrequency = 0;

  const currentScroll = newXY0();
  const velocity = newXY0();
  const destinationDirection = newXY0();
  const destinationScroll = newXY0();
  const overshoot = newXY0() as XY<number | boolean>;

  const update = ({ delta }: Readonly<ScrollAnimationInfo>, osInstance: OverlayScrollbars) => {
    const { overflowAmount } = osInstance.state();

    perAxis((axis) => {
      const axisDelta = delta[axis];
      const axisNewDestinationDirection = Math.sign(axisDelta);
      const axisDestinationDirectionChanged =
        destinationDirection[axis] !== axisNewDestinationDirection;

      destinationScroll[axis] =
        (axisDestinationDirectionChanged
          ? clamp(
              0,
              overflowAmount[axis],
              responsiveDirectionChange ? currentScroll[axis] : destinationScroll[axis]
            )
          : destinationScroll[axis]) + axisDelta;
      destinationDirection[axis] = axisNewDestinationDirection;
      overshoot[axis] = axisDelta ? 0 : overshoot[axis];
      springFrequency = Math.sqrt(
        Math.pow((2 * Math.PI) / Math.abs((durationOption || 1) / 1000), 2)
      );
      dampedSpringFrequency =
        dampingRatio < 1
          ? springFrequency * Math.sqrt(1 - dampingRatio * dampingRatio)
          : springFrequency * Math.sqrt(dampingRatio * dampingRatio - 1);
    });
  };

  return {
    start(animationInfo, osInstance) {
      const { getScroll } = animationInfo;
      perAxis((axis) => {
        overshoot[axis] = velocity[axis] = destinationDirection[axis] = 0;
        currentScroll[axis] = destinationScroll[axis] = getScroll()[axis];
      });

      update(animationInfo, osInstance);
    },
    update,
    frame(_, frameInfo, osInstance) {
      const { deltaTime } = frameInfo;
      const { overflowAmount } = osInstance.state();
      const deltaSeconds = deltaTime / 1000;
      const appliedScroll: Partial<XY<number>> = {};

      let stop = true;
      perAxis((axis) => {
        // can only happen if one axis is overshooting and the other isn't
        if (overshoot[axis]) {
          return;
        }

        const axisVelocity = velocity[axis];
        const axisOverflowAmount = overflowAmount[axis];
        const axisCurrentScroll = currentScroll[axis];
        const axisDestinationScroll = destinationScroll[axis];
        const axisClampedDestinationScroll = clamp(0, axisOverflowAmount, axisDestinationScroll);
        const axisFinalDestinationScroll = clampToViewport
          ? axisClampedDestinationScroll
          : axisDestinationScroll;
        const axisDistance = axisCurrentScroll - axisFinalDestinationScroll;

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

        const axisNewScroll = axisNewDistance + axisFinalDestinationScroll;
        const axisAppliedScroll = withPrecision(clamp(0, axisOverflowAmount, axisNewScroll));
        const axisOvershoot = getScrollOvershoot(axisNewScroll, axisOverflowAmount);

        overshoot[axis] = axisOvershoot;
        velocity[axis] = axisOvershoot ? 0 : axisNewVelocity;
        currentScroll[axis] = axisNewScroll;
        appliedScroll[axis] = axisAppliedScroll;

        stop =
          stop &&
          withPrecision(Math.abs(axisClampedDestinationScroll - axisNewScroll)) <
            stopDistanceEpsilon &&
          Math.abs(velocity[axis]) < stopVelocity;
      });

      return {
        stop,
        scroll: appliedScroll,
      };
    },
  };
};
