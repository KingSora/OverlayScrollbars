import type { Simulation } from './simulation';

export interface DampingSimulationParams {
  _damping: number;
}

export const dampingSimulation = (({ _damping }) => ({
  simulate: (displacement, _, deltaTimeSeconds) => {
    const newDisplacement = displacement * (1 - Math.pow(_damping, deltaTimeSeconds));

    return {
      _displacement: newDisplacement,
      _velocity: (newDisplacement + displacement) * -Math.log(_damping),
    };
  },
})) satisfies Simulation<DampingSimulationParams>;
