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
  domRectHasDimensions,
  domRectAppeared,
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

  test('domRectHasDimensions', () => {
    expect(
      domRectHasDimensions({
        width: 0,
        height: 0,
        bottom: 1,
        left: 1,
        right: 1,
        top: 1,
        x: 1,
        y: 1,
        toJSON: () => '',
      })
    ).toBe(false);
    expect(
      domRectHasDimensions({
        width: 0,
        height: 1,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        x: 0,
        y: 0,
        toJSON: () => '',
      })
    ).toBe(true);
    expect(
      domRectHasDimensions({
        width: 1,
        height: 0,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        x: 0,
        y: 0,
        toJSON: () => '',
      })
    ).toBe(true);
  });

  test('domRectAppeared', () => {
    expect(
      domRectAppeared(
        {
          width: 1,
          height: 1,
          bottom: 1,
          left: 1,
          right: 1,
          top: 1,
          x: 1,
          y: 1,
          toJSON: () => '',
        },
        {
          width: 0,
          height: 1,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          x: 0,
          y: 0,
          toJSON: () => '',
        }
      )
    ).toBe(false);

    expect(
      domRectAppeared(
        {
          width: 1,
          height: 1,
          bottom: 1,
          left: 1,
          right: 1,
          top: 1,
          x: 1,
          y: 1,
          toJSON: () => '',
        },
        {
          width: 0,
          height: 0,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          x: 0,
          y: 0,
          toJSON: () => '',
        }
      )
    ).toBe(true);
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
