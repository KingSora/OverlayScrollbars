export function clamp(min: number, max: number, current: number) {
  return Math.min(max, Math.max(min, current));
}

export function lerp(from: number, to: number, percent: number) {
  return (to - from) * percent + from;
}

export function damp(from: number, to: number, damping: number, deltaTimeSeconds: number) {
  const percent = 1 - Math.pow(damping, deltaTimeSeconds);
  return lerp(from, to, percent);
}

export function roundWithPrecision(value: number, precision: number) {
  return Math.round(value * precision) / precision;
}
