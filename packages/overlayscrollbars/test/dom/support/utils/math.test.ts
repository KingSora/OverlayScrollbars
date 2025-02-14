import { describe, test, expect } from 'vitest';
import { capNumber } from '../../../../src/support/utils/math';

describe('math utilities', () => {
  test('capNumber', () => {
    expect(capNumber(0, 1, 100)).toBe(1);
    expect(capNumber(0, 1, -100)).toBe(0);
    expect(capNumber(0, 1, 0.5)).toBe(0.5);
    expect(capNumber(0, 1, 0.25)).toBe(0.25);
    expect(capNumber(0, 1, 0.75)).toBe(0.75);
    expect(capNumber(0, 1, 0)).toBe(0);
    expect(capNumber(0, 1, 1)).toBe(1);
  });
});
