import { mathMax, mathMin } from './alias';

/**
 * Caps the passed number between the `min` and `max` bounds.
 * @param min The min bound.
 * @param max The max bound.
 * @param number The number to be capped.
 * @returns The capped number between min and max.
 */
export const capNumber = (min: number, max: number, number: number) =>
  mathMax(min, mathMin(max, number));
