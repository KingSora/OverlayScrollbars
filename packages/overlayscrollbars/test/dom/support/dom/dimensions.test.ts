import { describe, test, expect } from 'vitest';
import { isNumber, isPlainObject } from '../../../../src/support/utils/types';
import { createDiv } from '../../../../src/support/dom/create';
import {
  getWindowSize,
  getOffsetSize,
  getClientSize,
  getScrollSize,
  getFractionalSize,
  getBoundingClientRect,
  hasDimensions,
  domRectHasDimensions,
  domRectAppeared,
} from '../../../../src/support/dom/dimensions';

describe('dom dimensions', () => {
  describe('getOffsetSize', () => {
    test('DOM element', () => {
      const result = getOffsetSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = getOffsetSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  describe('getClientSize', () => {
    test('DOM element', () => {
      const result = getClientSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = getClientSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  describe('getScrollSize', () => {
    test('DOM element', () => {
      const result = getScrollSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = getScrollSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  describe('getFractionalSize', () => {
    test('DOM element', () => {
      const result = getFractionalSize(document.body);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });

    test('null', () => {
      const result = getFractionalSize(null);
      expect(isPlainObject(result)).toBe(true);
      expect(isNumber(result.w)).toBe(true);
      expect(isNumber(result.h)).toBe(true);
    });
  });

  test('getWindowSize', () => {
    const result = getWindowSize();
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
