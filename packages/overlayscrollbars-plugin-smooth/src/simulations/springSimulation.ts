import type { Simulation } from './simulation';

export interface SpringSimulationParams {
  /**
   * The mass attached to the spring in kilograms. Must be a number greater than 0.
   * The higher the mass, the longer it takes for the scroll destination to be reached.
   */
  _mass: number;
  /**
   * The stiffness of the spring in kilograms per second squared. Must be a number greater than 0.
   * If the stiffness is high, the spring will contract more powerfully and the scroll animation will feel snappy.
   */
  _stiffness: number;
  /**
   * The damping of the spring in kilograms per second. Must be a positive number or 0.
   * The higher the damping, the slower the scroll animation will be. If the damping is low enough it will create a bouncy effect.
   */
  _damping: number;
}

export const springSimulation = (({ _mass, _stiffness, _damping }) => {
  const dampingRatio = _damping / (2 * Math.sqrt(_stiffness * _mass));
  const lambda = _damping / _mass / 2;
  const natFreq = Math.sqrt(_stiffness / _mass);
  const natFreqDamped = natFreq * Math.sqrt(Math.abs(1 - dampingRatio * dampingRatio));

  return {
    simulate: (displacement: number, velocity: number, deltaTimeSeconds: number) => {
      const negativeDisplacement = displacement * -1;
      const expDelta = Math.exp(-lambda * deltaTimeSeconds);
      const natFreqDampedDelta = natFreqDamped * deltaTimeSeconds;

      // Critically damped
      if (dampingRatio === 1) {
        const c1 = negativeDisplacement;
        const c2 = velocity + lambda * negativeDisplacement;

        return {
          _displacement: displacement + expDelta * (c1 + c2 * deltaTimeSeconds),
          _velocity: (c1 + c2 * deltaTimeSeconds) * expDelta * -lambda + c2 * expDelta,
        };
      }
      // Underdamped
      else if (dampingRatio < 1) {
        const c1 = negativeDisplacement;
        const c2 = (velocity + lambda * negativeDisplacement) / natFreqDamped;
        const sin = Math.sin(natFreqDampedDelta);
        const cos = Math.cos(natFreqDampedDelta);

        return {
          _displacement: displacement + expDelta * (c1 * cos + c2 * sin),
          _velocity:
            expDelta * (c2 * natFreqDamped * cos - c1 * natFreqDamped * sin) +
            -lambda * (expDelta * (c1 * cos + c2 * sin)),
        };
      }
      // Overdamped
      else {
        const c1 =
          (velocity + negativeDisplacement * (lambda + natFreqDamped)) / (2 * natFreqDamped);
        const c2 = negativeDisplacement - c1;
        const ex1 = Math.exp(natFreqDampedDelta);
        const ex2 = Math.exp(-natFreqDampedDelta);

        return {
          _displacement: displacement + expDelta * (c1 * ex1 + c2 * ex2),
          _velocity:
            expDelta *
            (c1 * (-lambda + natFreqDamped) * ex1 + c2 * (-lambda - natFreqDamped) * ex2),
        };
      }
    },
  };
}) satisfies Simulation<SpringSimulationParams>;
