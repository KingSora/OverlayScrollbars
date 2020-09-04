import { isNumber, isPlainObject } from 'support/utils/types';
import { windowSize, offsetSize, clientSize, getBoundingClientRect } from 'support/dom/dimensions';

describe('dom dimensions', () => {
  describe('offsetSize', () => {
    test('DOM element', () => {
      const result = offsetSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = offsetSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  describe('clientSize', () => {
    test('DOM element', () => {
      const result = clientSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = clientSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  test('windowSize', () => {
    const result = windowSize();
    expect(isPlainObject(result)).toBe(true);
    expect(isNumber(result.w)).toBe(true);
    expect(isNumber(result.h)).toBe(true);
  });

  test('getBoundingClientRect', () => {
    expect(getBoundingClientRect(document.body)).toEqual(document.body.getBoundingClientRect());
  });
});
