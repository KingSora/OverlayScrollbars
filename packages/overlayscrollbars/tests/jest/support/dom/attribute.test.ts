import {
  attr,
  attrClass,
  hasAttrClass,
  removeAttr,
  val,
  scrollLeft,
  scrollTop,
} from 'support/dom/attribute';

const testElm = document.body;
const getAttribute = (name: string) => testElm.getAttribute(name);
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

    test('null', () => {
      expect(attr(null, 'hi')).toBe(null);
      expect(attr(null, 'hi', '123')).toBe(undefined);
    });
  });

  describe('attrClass', () => {
    test('add', () => {
      const attrName = 'data-test-attrClass-add';

      attrClass(testElm, attrName, '000', true);
      expect(getAttribute(attrName)).toBe('000');

      setAttribute(attrName, '123');
      attrClass(testElm, attrName, '456', true);
      expect(getAttribute(attrName)).toBe('123 456');

      attrClass(testElm, attrName, '789', true);
      attrClass(testElm, attrName, '789', true);
      expect(getAttribute(attrName)).toBe('123 456 789');

      attrClass(testElm, attrName, '', true);
      expect(getAttribute(attrName)).toBe('123 456 789');

      removeAttribute(attrName);
    });

    test('remove', () => {
      const attrName = 'data-test-attrClass-remove';

      setAttribute(attrName, '123');
      attrClass(testElm, attrName, '456');
      expect(getAttribute(attrName)).toBe('123');

      attrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');
      attrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');

      attrClass(testElm, attrName, '', true);
      expect(getAttribute(attrName)).toBe('');

      removeAttribute(attrName);
    });
  });

  describe('hasAttrClass', () => {
    test('hasAttrClass', () => {
      const attrName = 'data-test-hasAttrClass';

      expect(hasAttrClass(testElm, attrName, '123')).toBe(false);

      setAttribute(attrName, '123');
      attrClass(testElm, attrName, '456', true);
      attrClass(testElm, attrName, '789', true);
      expect(hasAttrClass(testElm, attrName, '123')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '456')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '789')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '123 456 789')).toBe(false);

      expect(hasAttrClass(testElm, attrName, '')).toBe(false);

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

    test('null', () => {
      expect(scrollLeft(null)).toBe(0);
      expect(scrollLeft(null, 0)).toBe(undefined);
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

    test('null', () => {
      expect(scrollTop(null)).toBe(0);
      expect(scrollTop(null, 0)).toBe(undefined);
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

    test('null', () => {
      expect(val(null)).toBe('');
      expect(val(null, '123')).toBe(undefined);
    });
  });

  describe('remove attribute', () => {
    test('normal', () => {
      const attrName = 'data-test-remove';

      setAttribute(attrName, '123');
      removeAttr(testElm, attrName);

      expect(attr(testElm, attrName)).toBeNull();
    });

    test('null', () => {
      expect(removeAttr(null, 'hi')).toBe(undefined);
    });
  });
});
