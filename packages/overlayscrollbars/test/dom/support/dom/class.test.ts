import { describe, test, beforeEach, expect } from 'vitest';
import { addClass, removeClass, hasClass, diffClass } from '../../../../src/support/dom/class';

const testElm = document.body;
const removeAllClassNames = () => {
  while (testElm.classList.length > 0) {
    const classToRemove = testElm.classList.item(0);
    if (classToRemove) {
      testElm.classList.remove(classToRemove);
    }
  }
};
const hasClassName = (className: string) => testElm.classList.contains(className);

describe('dom class names', () => {
  beforeEach(() => {
    removeAllClassNames();
  });

  describe('add', () => {
    test('none', () => {
      addClass(testElm, '');
      addClass(testElm, ' ');
      expect(testElm.classList.length).toBe(0);
    });

    test('single', () => {
      const remove = addClass(testElm, 'test-class');
      expect(hasClassName('test-class')).toBe(true);

      remove();
      expect(hasClassName('test-class')).toBe(false);
    });

    test('multiple', () => {
      const remove = addClass(testElm, 'test-class test-class2');
      expect(hasClassName('test-class')).toBe(true);
      expect(hasClassName('test-class2')).toBe(true);

      remove();
      expect(hasClassName('test-class')).toBe(false);
      expect(hasClassName('test-class2')).toBe(false);
    });

    test('null', () => {
      expect(typeof addClass(null, 'abc')).toBe('function');
    });
  });

  describe('remove', () => {
    test('none', () => {
      addClass(testElm, 'test-class');
      removeClass(testElm, '');
      removeClass(testElm, ' ');
      expect(testElm.classList.length).toBe(1);
    });

    test('single', () => {
      addClass(testElm, 'test-class');
      expect(hasClassName('test-class')).toBe(true);
      removeClass(testElm, 'test-class');
      expect(hasClassName('test-class')).toBe(false);
    });

    test('multiple', () => {
      addClass(testElm, 'test-class test-class2');
      removeClass(testElm, 'test-class test-class2');
      expect(hasClassName('test-class')).toBe(false);
      expect(hasClassName('test-class2')).toBe(false);
    });

    test('null', () => {
      expect(removeClass(null, 'abc')).toBe(undefined);
    });
  });

  describe('has', () => {
    test('none', () => {
      expect(hasClass(testElm, '')).toBe(false);
      expect(hasClass(testElm, ' ')).toBe(false);
    });

    test('single', () => {
      addClass(testElm, 'test-class');
      expect(hasClass(testElm, 'test-class')).toBe(true);
    });

    test('multiple', () => {
      addClass(testElm, 'test-class test-class2');
      expect(hasClass(testElm, 'test-class test-class2')).toBe(true);
      expect(hasClass(testElm, 'test-class test-class2 test-class3')).toBe(false);
    });

    test('null', () => {
      expect(hasClass(null, 'abc')).toBe(false);
    });
  });

  describe('diff', () => {
    test('none', () => {
      expect(diffClass('', '')).toEqual([]);
      expect(diffClass('', ' ')).toEqual([]);
    });

    test('single', () => {
      expect(diffClass('test', '')).toEqual(['test']);
      expect(diffClass('', 'test')).toEqual(['test']);
    });

    test('multiple', () => {
      expect(diffClass('a b c d', 'a c')).toEqual(['b', 'd']);
      expect(diffClass('d b', 'a b c d')).toEqual(['a', 'c']);
    });

    test('null', () => {
      expect(diffClass(null, null)).toEqual([]);
      expect(diffClass('a c', null)).toEqual(['a', 'c']);
      expect(diffClass('d b', null)).toEqual(['d', 'b']);
    });
  });
});
