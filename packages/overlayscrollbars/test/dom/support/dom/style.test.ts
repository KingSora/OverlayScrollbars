import { describe, test, beforeEach, expect } from 'vitest';
import { isEmptyObject } from '../../../../src/support/utils/object';
import { isString, isPlainObject } from '../../../../src/support/utils/types';
import {
  getStyles,
  setStyles,
  topRightBottomLeft,
  getTrasformTranslateValue,
} from '../../../../src/support/dom/style';

describe('dom style', () => {
  beforeEach(() => {
    document.body.removeAttribute('style');
  });

  describe('getStyles', () => {
    test('single', () => {
      expect(isString(getStyles(document.body, 'width'))).toBe(true);
    });

    test('multiple', () => {
      document.body.style.setProperty('--value', '123');
      const multiple = getStyles(document.body, ['width', 'height', '--read', '--value']);
      expect(isPlainObject(multiple)).toBe(true);
      expect(isString(multiple.width)).toBe(true);
      expect(isString(multiple.height)).toBe(true);
      expect(multiple['--read']).toBe('');
      expect(multiple['--value']).toBe('123');
    });

    test('null', () => {
      expect(getStyles(null, 'width')).toBe('');

      const widthHeight = getStyles(null, ['width', 'height']);
      expect(isPlainObject(widthHeight)).toBe(true);
      expect(isEmptyObject(widthHeight)).toBe(true);
    });
  });

  describe('setStyles', () => {
    test('single', () => {
      expect(document.body.style.width).toBe('');
      setStyles(document.body, { width: '123px' });
      expect(document.body.style.width).toBe('123px');

      expect(document.body.style.getPropertyValue('--custom')).toBe('');
      setStyles(document.body, { '--custom': '123px' });
      expect(document.body.style.getPropertyValue('--custom')).toBe('123px');
    });

    test('single add px', () => {
      expect(document.body.style.width).toBe('');
      setStyles(document.body, { width: 123 });
      expect(document.body.style.width).toBe('123px');
    });

    test('single dont add px', () => {
      expect(document.body.style.opacity).toBe('');
      setStyles(document.body, { opacity: '0.5' });
      expect(document.body.style.opacity).toBe('0.5');
    });

    test('multiple', () => {
      expect(document.body.style.width).toBe('');
      expect(document.body.style.height).toBe('');
      expect(document.body.style.opacity).toBe('');
      expect(document.body.style.zIndex).toBe('');
      expect(document.body.style.lineHeight).toBe('');
      expect(document.body.style.getPropertyValue('--write')).toBe('');
      setStyles(document.body, {
        width: '123px',
        height: 321,
        opacity: '0.5',
        zIndex: '1',
        '--write': '123',
      });
      expect(document.body.style.width).toBe('123px');
      expect(document.body.style.height).toBe('321px');
      expect(document.body.style.opacity).toBe('0.5');
      expect(document.body.style.zIndex).toBe('1');
      expect(document.body.style.getPropertyValue('--write')).toBe('123');
    });

    test('null', () => {
      expect(setStyles(null, { width: '123px' })).toBe(undefined);
      expect(setStyles(null, { width: '123px', height: '321px' })).toBe(undefined);
    });
  });

  describe('topRightBottomLeft', () => {
    describe('without prefix and suffix', () => {
      test('normal', () => {
        const result = topRightBottomLeft(document.body);
        expect(result.t).toBe(0);
        expect(result.r).toBe(0);
        expect(result.b).toBe(0);
        expect(result.l).toBe(0);
      });

      test('null', () => {
        const result = topRightBottomLeft(null);
        expect(result.t).toBe(0);
        expect(result.r).toBe(0);
        expect(result.b).toBe(0);
        expect(result.l).toBe(0);
      });
    });

    describe('with prefix and suffix', () => {
      test('normal', () => {
        const result = topRightBottomLeft(document.body, 'border', 'width');
        expect(result.t).toBe(0);
        expect(result.r).toBe(0);
        expect(result.b).toBe(0);
        expect(result.l).toBe(0);
      });

      test('null', () => {
        const result = topRightBottomLeft(null, 'border', 'width');
        expect(result.t).toBe(0);
        expect(result.r).toBe(0);
        expect(result.b).toBe(0);
        expect(result.l).toBe(0);
      });
    });
  });

  describe('getTrasformTranslateValue', () => {
    test('horizontal and vertical', () => {
      expect(getTrasformTranslateValue({ x: '1px', y: '1%' })).toBe('translate(1px,1%)');
      expect(getTrasformTranslateValue({ x: 0, y: 1 })).toBe('translate(0,1)');
    });

    test('horizontal only', () => {
      expect(getTrasformTranslateValue('1px', true)).toBe('translateX(1px)');
      expect(getTrasformTranslateValue(0, true)).toBe('translateX(0)');
    });

    test('vertical only', () => {
      expect(getTrasformTranslateValue('1%')).toBe('translateY(1%)');
      expect(getTrasformTranslateValue(0)).toBe('translateY(0)');
    });
  });
});
