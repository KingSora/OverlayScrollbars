import type { XY } from './utils';
import { solveLsq } from './lsq-solver';
import { newXY0 } from './utils';

const pointerMoveStoppedMs = 40;
const sampleHistorySize = 20;
const horizonMilliseconds = 100;
const minSamples = 3;

export interface VelocitySample {
  /** The timestamp in ms. */
  _timestamp: number;
  /** The position data. */
  _position: XY<number>;
}

interface VelocityEstimate {
  /** Velocity in px/s for the x and y axis. */
  _velocity: XY<number>;
  /** A value 0..1 that indicates how well the sample data fitted a straight line. 1 is a perfect fit, 0 for a poor fit. */
  _confidence: number;
  /** The time delta between the first and last sample used. */
  _timeDelta: number;
  /** The position delta between the first and last sample used. */
  _positionDelta: XY<number>;
}

export const createVelocitySampler = () => {
  const samples: VelocitySample[] = [];
  const getVelocityEstimate = (): VelocityEstimate | null => {
    const xPositions: number[] = [];
    const yPositions: number[] = [];
    const weights: number[] = [];
    const times: number[] = [];
    const newestSampleIndex = samples.length - 1;
    const newestSample: VelocitySample | undefined = samples[newestSampleIndex];

    if (!newestSample) {
      return null;
    }

    let previousSample: VelocitySample = newestSample;
    let oldestSample: VelocitySample = newestSample;

    for (let sampleIndex = newestSampleIndex; sampleIndex >= 0; sampleIndex--) {
      const sample: VelocitySample | undefined = samples[sampleIndex];
      if (!sample) {
        break;
      }

      const age = newestSample._timestamp - sample._timestamp;
      const delta = sample._timestamp - previousSample._timestamp;

      previousSample = sample;

      if (age > horizonMilliseconds || delta > pointerMoveStoppedMs) {
        break;
      }

      oldestSample = sample;

      const { _position: position } = sample;
      xPositions.push(position.x);
      yPositions.push(position.y);
      weights.push(1);
      times.push(-age);
    }

    if (times.length >= minSamples) {
      const xFit = solveLsq(times, xPositions, weights, 2);
      if (xFit) {
        const yFit = solveLsq(times, yPositions, weights, 2);
        if (yFit) {
          return {
            _velocity: {
              x: xFit.coeff[1] * 1000, // px/ms to px/s
              y: yFit.coeff[1] * 1000,
            },
            _confidence: xFit.confidence * yFit.confidence,
            _timeDelta: newestSample._timestamp - oldestSample._timestamp,
            _positionDelta: {
              x: newestSample._position.x - oldestSample._position.x,
              y: newestSample._position.y - oldestSample._position.y,
            },
          };
        }
      }
    }

    return {
      _confidence: 1,
      _timeDelta: newestSample._timestamp - oldestSample._timestamp,
      _positionDelta: {
        x: newestSample._position.x - oldestSample._position.x,
        y: newestSample._position.y - oldestSample._position.y,
      },
      _velocity: newXY0(),
    };
  };

  return {
    addSample(sample: VelocitySample) {
      const samplesCount = samples.length;
      const lastSample = samples[samplesCount - 1];

      // if too much time elapsed between last and current sample
      if (lastSample && sample._timestamp - lastSample._timestamp > pointerMoveStoppedMs) {
        samples.splice(0, samples.length);
      }

      // if we have too many samples
      if (samplesCount >= sampleHistorySize) {
        samples.shift();
      }

      samples.push(sample);
    },
    getVelocity() {
      const estimate = getVelocityEstimate();
      return estimate ? estimate._velocity : newXY0();
    },
  };
};

const v = createVelocitySampler();
v.addSample({ _position: { x: 1, y: 1 }, _timestamp: 0 });
v.addSample({ _position: { x: 2, y: 2 }, _timestamp: 1 });
v.addSample({ _position: { x: 3, y: 3 }, _timestamp: 2 });

v.addSample({ _position: { x: 1, y: 1 }, _timestamp: 50 });
v.addSample({ _position: { x: 2, y: 2 }, _timestamp: 51 });
v.addSample({ _position: { x: 3, y: 3 }, _timestamp: 52 });

console.log(v.getVelocity());
