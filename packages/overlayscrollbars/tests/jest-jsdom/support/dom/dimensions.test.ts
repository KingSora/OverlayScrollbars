import { isNumber, isPlainObject } from '~/support/utils/types';
import { createDiv } from '~/support/dom/create';
import {
  windowSize,
  offsetSize,
  clientSize,
  scrollSize,
  fractionalSize,
  getBoundingClientRect,
  hasDimensions,
} from '~/support/dom/dimensions';

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

  describe('scrollSize', () => {
    test('DOM element', () => {
      const result = scrollSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = scrollSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  describe('fractionalSize', () => {
    test('DOM element', () => {
      const result = fractionalSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = fractionalSize(null);
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

  describe('hasDimensions', () => {
    test('DOM element', () => {
      const result = hasDimensions(document.body);
      expect(result).toBe(false);
    });

    test('generated element', () => {
      const div = createDiv();
      const result = hasDimensions(div);
      expect(result).toBe(false);
    });

    test('null', () => {
      const result = hasDimensions(null);
      expect(result).toBe(false);
    });
  });
});
