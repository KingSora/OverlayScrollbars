export interface SimulationInstance {
  simulate: (
    displacement: number,
    velocity: number,
    deltaTime: number
  ) => {
    _displacement: number;
    _velocity: number;
  };
}

export type Simulation<P> = (params: P) => SimulationInstance;
