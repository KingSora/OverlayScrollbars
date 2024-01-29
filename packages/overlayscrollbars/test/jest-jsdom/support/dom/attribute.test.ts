import {
  addAttrClass,
  removeAttrClass,
  hasAttrClass,
  removeAttrs,
  getAttr,
  setAttrs,
} from '~/support/dom/attribute';

const testElm = document.body;
const getAttribute = (name: string) => testElm.getAttribute(name);
const setAttribute = (name: string, value: string) => {
  testElm.setAttribute(name, value);
};
const removeAttribute = (name: string) => {
  testElm.removeAttribute(name);
};

describe('dom attributes', () => {
  test('getAttr', () => {
    const attrName = 'data-test-get';

    setAttribute(attrName, '123');
    expect(getAttr(testElm, attrName)).toBe('123');

    setAttribute(attrName, 'abc');
    expect(getAttr(testElm, attrName)).toBe('abc');

    removeAttribute(attrName);
  });

  test('setAttrs', () => {
    const attrName = 'data-test-set';
    const attrName2 = 'data-test-set';

    setAttrs(testElm, attrName, '123');
    expect(getAttr(testElm, attrName)).toBe('123');

    setAttrs(testElm, attrName, 'abc');
    expect(getAttr(testElm, attrName)).toBe('abc');

    removeAttribute(attrName);

    setAttrs(testElm, `${attrName} ${attrName2}`, '123');
    expect(getAttr(testElm, attrName)).toBe('123');
    expect(getAttr(testElm, attrName2)).toBe('123');

    setAttrs(testElm, `${attrName} ${attrName2}`, 'abc');
    expect(getAttr(testElm, attrName)).toBe('abc');
    expect(getAttr(testElm, attrName2)).toBe('abc');

    removeAttribute(attrName);
  });

  describe('addAttrClass', () => {
    test('add', () => {
      const attrName = 'data-test-attrClass-add';

      addAttrClass(testElm, attrName, '000');
      expect(getAttribute(attrName)).toBe('000');

      setAttribute(attrName, '123');
      addAttrClass(testElm, attrName, '456');
      expect(getAttribute(attrName)).toBe('123 456');

      addAttrClass(testElm, attrName, '789');
      addAttrClass(testElm, attrName, '789');
      expect(getAttribute(attrName)).toBe('123 456 789');

      addAttrClass(testElm, attrName, '');
      expect(getAttribute(attrName)).toBe('123 456 789');

      removeAttribute(attrName);
    });

    test('remove', () => {
      const attrName = 'data-test-attrClass-remove';

      setAttribute(attrName, '123');
      removeAttrClass(testElm, attrName, '456');
      expect(getAttribute(attrName)).toBe('123');

      removeAttrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');
      removeAttrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');

      removeAttrClass(testElm, attrName, '');
      expect(getAttribute(attrName)).toBe('');

      removeAttribute(attrName);
    });
  });

  describe('hasAttrClass', () => {
    test('hasAttrClass', () => {
      const attrName = 'data-test-hasAttrClass';

      expect(hasAttrClass(testElm, attrName, '123')).toBe(false);

      setAttribute(attrName, '123');
      addAttrClass(testElm, attrName, '456 789');
      expect(hasAttrClass(testElm, attrName, '123')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '456')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '789')).toBe(true);
      expect(hasAttrClass(testElm, attrName, '123 456 789')).toBe(true);

      expect(hasAttrClass(testElm, attrName, '')).toBe(false);

      removeAttribute(attrName);
    });
  });

  test('remove attributes', () => {
    const attrName = 'data-test-remove';
    const attrName2 = 'data-test-remove2';

    setAttribute(attrName, '123');
    setAttribute(attrName2, '123');
    removeAttrs(testElm, attrName);

    expect(getAttr(testElm, attrName)).toBeNull();
    expect(getAttr(testElm, attrName2)).toBe('123');

    setAttribute(attrName, '123');
    setAttribute(attrName2, '123');
    removeAttrs(testElm, `${attrName} ${attrName2}`);

    expect(getAttr(testElm, attrName)).toBeNull();
    expect(getAttr(testElm, attrName2)).toBeNull();
  });
});
