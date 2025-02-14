import { describe, test, expect } from 'vitest';
import {
  addAttrClass,
  removeAttrClass,
  hasAttrClass,
  removeAttrs,
  getAttr,
  setAttrs,
  hasAttr,
} from '../../../../src/support/dom/attribute';

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

  test('hasAttr', () => {
    const attrName = 'data-test-get';

    setAttribute(attrName, '123');
    expect(hasAttr(testElm, attrName)).toBe(true);

    removeAttrs(testElm, attrName);
    expect(hasAttr(testElm, attrName)).toBe(false);

    removeAttribute(attrName);
  });

  describe('addAttrClass', () => {
    test('add', () => {
      const attrName = 'data-test-attrClass-add';

      const remove = addAttrClass(testElm, attrName, '000');
      expect(getAttribute(attrName)).toBe('000');

      remove();
      expect(getAttribute(attrName)).toBe('');

      setAttribute(attrName, '123');
      const remove1 = addAttrClass(testElm, attrName, '456');
      expect(getAttribute(attrName)).toBe('123 456');

      const remove2 = addAttrClass(testElm, attrName, '789');
      const remove3 = addAttrClass(testElm, attrName, '789');
      expect(getAttribute(attrName)).toBe('123 456 789');

      const remove4 = addAttrClass(testElm, attrName, '');
      expect(getAttribute(attrName)).toBe('123 456 789');

      remove1();
      remove2();
      remove3();
      remove4();

      expect(getAttribute(attrName)).toBe('123');

      removeAttribute(attrName);
    });

    test('remove', () => {
      const attrName = 'data-test-attrClass-remove';

      setAttribute(attrName, '123');
      const add = removeAttrClass(testElm, attrName, '456');
      expect(getAttribute(attrName)).toBe('123');

      add();
      expect(getAttribute(attrName)).toBe('123 456');

      setAttribute(attrName, '123');

      const add1 = removeAttrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');
      const add2 = removeAttrClass(testElm, attrName, '123');
      expect(getAttribute(attrName)).toBe('');

      const add3 = removeAttrClass(testElm, attrName, '');
      expect(getAttribute(attrName)).toBe('');

      add1();
      add2();
      add3();

      expect(getAttribute(attrName)).toBe('123');

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
