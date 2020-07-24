import { attr, removeAttr, val, scrollLeft, scrollTop } from 'core/dom/attribute';

const testElm = document.body;
const setAttribute = (name: string, value: string) => {
  testElm.setAttribute(name, value);
};
const setScrollLeft = (value: number) => {
  testElm.scrollLeft = value;
};
const setScrollTop = (value: number) => {
  testElm.scrollTop = value;
};
const removeAttribute = (name: string) => {
  testElm.removeAttribute(name);
};

describe('dom attributes', () => {
  describe('attr', () => {
    test('get', () => {
      const attrName = 'data-test-get';

      setAttribute(attrName, '123');
      expect(attr(testElm, attrName)).toBe('123');

      setAttribute(attrName, 'abc');
      expect(attr(testElm, attrName)).toBe('abc');

      removeAttribute(attrName);
    });

    test('set', () => {
      const attrName = 'data-test-set';

      attr(testElm, attrName, '123');
      expect(attr(testElm, attrName)).toBe('123');

      attr(testElm, attrName, 'abc');
      expect(attr(testElm, attrName)).toBe('abc');

      removeAttribute(attrName);
    });
  });

  describe('scrollLeft', () => {
    test('get', () => {
      setScrollLeft(100);
      expect(scrollLeft(testElm)).toBe(100);
      setScrollLeft(0);
    });

    test('set', () => {
      scrollLeft(testElm, 100);
      expect(scrollLeft(testElm)).toBe(100);
      setScrollLeft(0);
    });
  });

  describe('scrollTop', () => {
    test('get', () => {
      setScrollTop(100);
      expect(scrollTop(testElm)).toBe(100);
      setScrollTop(0);
    });

    test('set', () => {
      scrollTop(testElm, 100);
      expect(scrollTop(testElm)).toBe(100);
      setScrollTop(0);
    });
  });

  describe('val', () => {
    const input = document.createElement('input');

    test('get', () => {
      input.value = 'hi';
      expect(val(input)).toBe('hi');
      input.value = '';
    });

    test('set', () => {
      val(input, 'hi2');
      expect(val(input)).toBe('hi2');
      val(input, '');
      expect(val(input)).toBe('');
    });
  });

  test('remove attribute', () => {
    const attrName = 'data-test-remove';

    setAttribute(attrName, '123');
    removeAttr(testElm, attrName);

    expect(attr(testElm, attrName)).toBeNull();
  });
});
