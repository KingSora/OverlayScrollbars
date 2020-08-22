import { addClass, removeClass, hasClass } from 'support/dom/class';

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
  afterEach(() => {
    removeAllClassNames();
  });

  describe('add', () => {
    test('none', () => {
      addClass(testElm, '');
      // @ts-ignore
      addClass(testElm, null);
      // @ts-ignore
      addClass(testElm, 2);
      expect(testElm.classList.length).toBe(0);
    });

    test('single', () => {
      addClass(testElm, 'test-class');
      expect(hasClassName('test-class')).toBe(true);
    });

    test('multiple', () => {
      addClass(testElm, 'test-class test-class2');
      expect(hasClassName('test-class')).toBe(true);
      expect(hasClassName('test-class2')).toBe(true);
    });

    test('null', () => {
      expect(addClass(null, 'abc')).toBe(undefined);
    });
  });

  describe('remove', () => {
    test('none', () => {
      addClass(testElm, 'test-class');
      removeClass(testElm, '');
      // @ts-ignore
      removeClass(testElm, null);
      // @ts-ignore
      removeClass(testElm, 2);
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
});
