import type { XY } from './utils';
import type { VelocityEstimate } from './velocity-sampler';
import { clamp, newXY0, perAxis } from './utils';

export interface Fling {
  /** The fling timestamp. */
  timestamp: number;
  /** The fling delta in pixel. */
  delta: XY<number>;
  /** The fling duration in milliseconds */
  duration: XY<number>;
  /** The fling velocity in px/s. */
  velocity: XY<number>;
}

const minFlingVelocity = 50; // px/s
const minFlingDelta = 18; // px
// const damping = 0.01;
// const decelerationRate = 1 - damping;
// const decelerationFactorSeconds = 1000 * Math.log(decelerationRate);

const INFLEXION = 0.35; // Tension lines cross at (INFLEXION, 1)
const DECELERATION_RATE = Math.log(0.78) / Math.log(0.9);
const mPhysicalCoeff =
  9.80665 * // // gravity in meters per second squared
  39.37 * // inch/meter
  160.0 * // ppi
  0.84;
const SCROLL_FRICTION = 0.015;
const scrollCoeff = SCROLL_FRICTION * mPhysicalCoeff;
const decelMinusOne = DECELERATION_RATE - 1.0;
const maxFlingVelocity = 8000; // px/s

const getSplineDeceleration = (velocity: number) =>
  Math.log((INFLEXION * Math.abs(velocity)) / scrollCoeff);

const getSplineFlingDistance = (velocity: number) =>
  scrollCoeff * Math.exp((DECELERATION_RATE / decelMinusOne) * getSplineDeceleration(velocity));

const getSplineFlingDurationMs = (velocity: number) =>
  1000 * Math.exp(getSplineDeceleration(velocity) / decelMinusOne);

export const createFling = (
  velocityEstimate: VelocityEstimate,
  timestamp: number,
  lastFling?: Fling | null
) => {
  const delta = newXY0();
  const duration = newXY0();
  const velocity = newXY0();
  const { _velocity, _positionDelta, _timeDelta } = velocityEstimate;

  perAxis((axis) => {
    const axisEstimatedVelocity = -_velocity[axis];
    const axisEstimatedVelocityDelta = _positionDelta[axis];
    let axisLastFlingAdditiveVelocity = 0;

    if (lastFling) {
      const axisLastDelta = lastFling.delta[axis];
      const axisLastDuration = lastFling.duration[axis];
      const axisLastVelocity = lastFling.velocity[axis];
      const axisRemainingDuration = timestamp - lastFling.timestamp;

      if (
        axisLastDelta &&
        axisLastDuration &&
        axisRemainingDuration &&
        axisRemainingDuration < axisLastDuration && // last fling is not over
        Math.sign(axisEstimatedVelocity) === Math.sign(axisLastVelocity) // last fling is in same direction
      ) {
        // add `_timeDelta` to compensate for the time it took to do the new fling
        const percent = clamp(0, 1, (axisRemainingDuration + _timeDelta) / axisLastDuration);
        axisLastFlingAdditiveVelocity = axisLastVelocity * percent;
      }
    }

    // only apply delta and velocity if estimated velocity is considered a fling
    if (
      Math.abs(axisEstimatedVelocity) > minFlingVelocity &&
      Math.abs(axisEstimatedVelocityDelta) > minFlingDelta
    ) {
      const axisAdditiveVelocity = axisLastFlingAdditiveVelocity + axisEstimatedVelocity;
      const axisVelocitySign = Math.sign(axisAdditiveVelocity);
      const axisClampedAdditiveVelocity =
        clamp(0, maxFlingVelocity, Math.abs(axisAdditiveVelocity)) * axisVelocitySign;

      delta[axis] = getSplineFlingDistance(axisClampedAdditiveVelocity) * axisVelocitySign;
      duration[axis] = getSplineFlingDurationMs(axisClampedAdditiveVelocity);
      velocity[axis] = axisClampedAdditiveVelocity;
    }
  });

  return {
    timestamp,
    delta,
    duration,
    velocity,
  };
};
