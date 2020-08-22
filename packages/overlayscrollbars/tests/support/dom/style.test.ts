import { isString, isPlainObject, isEmptyObject } from 'support/utils/types';
import { style, hide, show } from 'support/dom/style';

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
        style(document.body, { width: '123px', height: 321, opacity: '0.5', zIndex: 1 });
        expect(document.body.style.width).toBe('123px');
        expect(document.body.style.height).toBe('321px');
        expect(document.body.style.opacity).toBe('0.5');
        expect(document.body.style.zIndex).toBe('1');
      });

      test('null', () => {
        expect(style(null, { width: '123px' })).toBe(undefined);
        expect(style(null, { width: '123px', height: '321px' })).toBe(undefined);
      });
    });
  });

  describe('hide', () => {
    test('normal', () => {
      expect(document.body.style.display).toBe('');
      hide(document.body);
      expect(document.body.style.display).toBe('none');
    });

    test('null', () => {
      expect(hide(null)).toBe(undefined);
    });
  });

  describe('show', () => {
    test('normal', () => {
      expect(document.body.style.display).toBe('');
      show(document.body);
      expect(document.body.style.display).toBe('block');
    });

    test('null', () => {
      expect(show(null)).toBe(undefined);
    });
  });
});
