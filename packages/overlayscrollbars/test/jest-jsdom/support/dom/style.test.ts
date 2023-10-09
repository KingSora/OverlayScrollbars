import { isEmptyObject } from '~/support/utils/object';
import { isString, isPlainObject } from '~/support/utils/types';
import {
  style,
  topRightBottomLeft,
  getDirectionIsRTL,
  getTrasformTranslateValue,
} from '~/support/dom/style';

describe('dom style', () => {
  afterEach(() => {
    document.body.removeAttribute('style');
  });

  describe('style', () => {
    describe('get', () => {
      test('single', () => {
        expect(isString(style(document.body, 'width'))).toBe(true);
      });

      test('multiple', () => {
        const widthHeight = style(document.body, ['width', 'height']);
        expect(isPlainObject(widthHeight)).toBe(true);
        expect(isString(widthHeight.width)).toBe(true);
        expect(isString(widthHeight.height)).toBe(true);
      });

      test('null', () => {
        expect(style(null, 'width')).toBe('');

        const widthHeight = style(null, ['width', 'height']);
        expect(isPlainObject(widthHeight)).toBe(true);
        expect(isEmptyObject(widthHeight)).toBe(true);
      });
    });

    describe('set', () => {
      test('single', () => {
        expect(document.body.style.width).toBe('');
        style(document.body, { width: '123px' });
        expect(document.body.style.width).toBe('123px');

        expect(document.body.style.getPropertyValue('--custom')).toBe('');
        style<'--custom'>(document.body, { '--custom': '123px' });
        expect(document.body.style.getPropertyValue('--custom')).toBe('123px');
      });

      test('single add px', () => {
        expect(document.body.style.width).toBe('');
        style(document.body, { width: 123 });
        expect(document.body.style.width).toBe('123px');
      });

      test('single dont add px', () => {
        expect(document.body.style.opacity).toBe('');
        style(document.body, { opacity: 0.5 });
        expect(document.body.style.opacity).toBe('0.5');
      });

      test('multiple', () => {
        expect(document.body.style.width).toBe('');
        expect(document.body.style.height).toBe('');
        expect(document.body.style.opacity).toBe('');
        expect(document.body.style.zIndex).toBe('');
        expect(document.body.style.lineHeight).toBe('');
        expect(document.body.style.getPropertyValue('--custom')).toBe('');
        style<'--custom'>(document.body, {
          width: '123px',
          height: 321,
          opacity: '0.5',
          zIndex: 1,
          '--custom': '123px',
        });
        expect(document.body.style.width).toBe('123px');
        expect(document.body.style.height).toBe('321px');
        expect(document.body.style.opacity).toBe('0.5');
        expect(document.body.style.zIndex).toBe('1');
        expect(document.body.style.getPropertyValue('--custom')).toBe('123px');
      });

      test('null', () => {
        expect(style(null, { width: '123px' })).toBe(undefined);
        expect(style(null, { width: '123px', height: '321px' })).toBe(undefined);
      });
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

  describe('directionIsRTL', () => {
    test('normal', () => {
      document.body.setAttribute('style', 'direction: rtl');
      expect(getDirectionIsRTL(document.body)).toBe(true);

      document.body.setAttribute('style', 'direction: ltr');
      expect(getDirectionIsRTL(document.body)).toBe(false);
    });

    test('null', () => {
      expect(getDirectionIsRTL(null)).toBe(false);
    });
  });

  describe('getTrasformTranslateValue', () => {
    test('horizontal and vertical', () => {
      expect(getTrasformTranslateValue(['1px', '1%'])).toBe('translate(1px,1%)');
      expect(getTrasformTranslateValue([0, 1])).toBe('translate(0,1)');
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
