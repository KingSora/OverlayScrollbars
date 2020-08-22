import { isNumber, isPlainObject } from 'support/utils/types';
import { offset, position } from 'support/dom/offset';

describe('dom offset', () => {
  describe('offset', () => {
    test('returns correct object with DOM element', () => {
      const result = offset(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.left)).toBe(true);
      expect(isNumber(result.top)).toBe(true);
    });

    test('returns correct object with null', () => {
      const result = offset(null);
      expect(isPlainObject(result)).toBe(true);
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
    });
  });

  describe('position', () => {
    test('returns correct object with DOM element', () => {
      const result = position(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.left)).toBe(true);
      expect(isNumber(result.top)).toBe(true);
    });

    test('returns correct object with null', () => {
      const result = position(null);
      expect(isPlainObject(result)).toBe(true);
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
    });
  });
});
