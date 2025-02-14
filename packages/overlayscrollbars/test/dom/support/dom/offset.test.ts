import { describe, test, expect } from 'vitest';
import { isNumber, isPlainObject } from '../../../../src/support/utils/types';
import { absoluteCoordinates, offsetCoordinates } from '../../../../src/support/dom/offset';

describe('dom offset', () => {
  describe('absoluteCoordinates', () => {
    test('DOM element', () => {
      const result = absoluteCoordinates(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.x)).toBe(true);
      expect(isNumber(result.y)).toBe(true);
    });

    test('null', () => {
      const result = absoluteCoordinates(null);
      expect(isPlainObject(result)).toBe(true);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  describe('offsetCoordinates', () => {
    test('DOM element', () => {
      const result = offsetCoordinates(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.x)).toBe(true);
      expect(isNumber(result.y)).toBe(true);
    });

    test('null', () => {
      const result = offsetCoordinates(null);
      expect(isPlainObject(result)).toBe(true);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });
});
