import type { XY } from './utils';
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

export interface VelocityEstimate {
  /** The time delta between the first and last sample used. */
  _timeDelta: number;
  /** The position delta between the first and last sample used. */
  _positionDelta: XY<number>;
  /** Velocity in px/s for the x and y axis. */
  _velocity: XY<number>;
}

const solveUnweightedLeastSquaresDeg2 = (x: number[], y: number[]) => {
  const { length: count } = x;
  let sxi = 0;
  let sxiyi = 0;
  let syi = 0;
  let sxi2 = 0;
  let sxi3 = 0;
  let sxi2yi = 0;
  let sxi4 = 0;

  for (let i = 0; i < count; i++) {
    const xi = x[i];
    const yi = y[i];
    const xi2 = xi * xi;
    const xi3 = xi2 * xi;
    const xi4 = xi3 * xi;
    const xiyi = xi * yi;
    const xi2yi = xi2 * yi;
    sxi += xi;
    sxi2 += xi2;
    sxiyi += xiyi;
    sxi2yi += xi2yi;
    syi += yi;
    sxi3 += xi3;
    sxi4 += xi4;
  }

  const sxx = sxi2 - (sxi * sxi) / count;
  const sxy = sxiyi - (sxi * syi) / count;
  const sxx2 = sxi3 - (sxi * sxi2) / count;
  const sx2y = sxi2yi - (sxi2 * syi) / count;
  const sx2x2 = sxi4 - (sxi2 * sxi2) / count;
  const denominator = sxx * sx2x2 - sxx2 * sxx2;

  if (!denominator) {
    return null;
  }

  const a = (sx2y * sxx - sxy * sxx2) / denominator;
  const b = (sxy * sx2x2 - sx2y * sxx2) / denominator;
  const c = syi / count - (b * sxi) / count - (a * sxi2) / count;

  return [a, b, c];
};

export const createSampleFromTouchEvent = ({
  timeStamp,
  changedTouches,
}: TouchEvent): VelocitySample => {
  const [touch] = changedTouches;
  return {
    _timestamp: timeStamp,
    _position: {
      x: touch.pageX,
      y: touch.pageY,
    },
  };
};

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
      const xCoeffs = solveUnweightedLeastSquaresDeg2(times, xPositions);
      if (xCoeffs) {
        const yCoeffs = solveUnweightedLeastSquaresDeg2(times, yPositions);
        if (yCoeffs) {
          return {
            _velocity: {
              x: xCoeffs[1] * 1000, // px/ms to px/s
              y: yCoeffs[1] * 1000,
            },
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
    getVelocityEstimate,
  };
};
