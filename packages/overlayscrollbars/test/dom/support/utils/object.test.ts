import { describe, test, expect } from 'vitest';
import {
  assignDeep,
  keys,
  hasOwnProperty,
  isEmptyObject,
  removeUndefinedProperties,
} from '../../../../src/support/utils/object';
import { isPlainObject } from '../../../../src/support/utils/types';

describe('object utilities', () => {
  // https://github.com/jquery/jquery/blob/master/test/unit/core.js#L965
  describe('assignDeep', () => {
    // type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T
    type Deep = {
      foo?: {
        bar?: boolean;
        baz?: boolean;
      };
      foo2?: Document;
    };
    type Settings = {
      xnumber0?: null;
      xnumber1?: number | null;
      xnumber2?: number | null;
      xstring1?: string;
      xstring2?: string;
      xxx?: string;
    };
    type NestedArray = {
      arr: Array<any> | object;
    };

    test('equals object assign', () => {
      let settings: Settings = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
      const options: Settings = { xnumber2: 1, xstring2: 'x', xxx: 'newstring' };
      const optionsCopy: Settings = { xnumber2: 1, xstring2: 'x', xxx: 'newstring' };
      const merged: Settings = {
        xnumber1: 5,
        xnumber2: 1,
        xstring1: 'peter',
        xstring2: 'x',
        xxx: 'newstring',
      };

      assignDeep(settings, options);
      expect(settings).toEqual(merged);
      expect(options).toEqual(optionsCopy);

      assignDeep(settings, null, options);
      expect(settings).toEqual(merged);
      expect(options).toEqual(optionsCopy);

      const deep1: Deep = { foo: { bar: true } };
      const deep2: Deep = { foo: { baz: true }, foo2: document };
      const deep2copy: Deep = { foo: { baz: true }, foo2: document };
      const deepmerged: Deep = { foo: { bar: true, baz: true }, foo2: document };

      assignDeep(deep1, deep2);
      expect(deep1.foo).toEqual(deepmerged.foo);
      expect(deep2.foo).toEqual(deep2copy.foo);
      expect(deep1.foo2).toBe(document);

      const arr = [1, 2, 3];
      const o = {};
      const nestedArray: NestedArray = { arr };
      const nestedObj = { o };

      expect(assignDeep({}, nestedArray).arr).not.toBe(arr);
      expect(assignDeep({}, nestedObj).o).not.toBe(o);
      expect(Array.isArray(assignDeep({ arr: {} }, nestedArray).arr)).toBeTruthy();
      expect(Array.isArray(assignDeep({ arr: {} }, nestedArray).arr)).toBeTruthy();
      expect(isPlainObject(assignDeep({ arr }, { arr: {} }).arr)).toBeTruthy();
      expect(assignDeep({ arr }, { arr: [] }).arr).toEqual([]);

      let empty: { foo?: any } = {};
      const optionsWithLength = { foo: { length: -1 } };

      assignDeep(empty, optionsWithLength);
      expect(empty.foo).toEqual(optionsWithLength.foo);

      empty = {};
      const optionsWithDate = { foo: { date: new Date() } };

      assignDeep(empty, optionsWithDate);
      expect(empty.foo).toEqual(optionsWithDate.foo);

      /** @constructor */
      const MyKlass = function () {};
      // @ts-ignore
      const customObject = new MyKlass();
      const optionsWithCustomObject = { foo: { date: customObject } };
      empty = {};

      assignDeep(empty, optionsWithCustomObject);
      expect(empty.foo && empty.foo.date === customObject).toBeTruthy();

      // Makes the class a little more realistic
      MyKlass.prototype = { someMethod() {} };
      empty = {};

      assignDeep(empty, optionsWithCustomObject);
      expect(empty.foo && empty.foo.date === customObject).toBeTruthy();

      const MyNumber = Number;

      let ret: any = assignDeep({ foo: 4 }, { foo: new MyNumber(5) });
      expect(parseInt(ret.foo?.toString() as string, 10) === 5).toBeTruthy();

      let nullUndef = assignDeep({}, options, { xnumber2: null });
      expect(nullUndef.xnumber2).toBe(null);

      // @ts-ignore
      nullUndef = assignDeep({}, options, {});
      expect(nullUndef.xnumber2).toBe(options.xnumber2);

      // @ts-ignore
      nullUndef = assignDeep({}, options, { xnumber2: undefined });
      expect(nullUndef.xnumber2).toBe(undefined);

      // @ts-ignore
      nullUndef = assignDeep({}, options, { xnumber0: null });
      expect(nullUndef.xnumber0).toBe(null);

      const target = {};
      const recursive = { foo: target, bar: 5 };

      assignDeep(target, recursive);
      expect(target).toEqual({ bar: 5 });

      ret = assignDeep({ foo: [] }, { foo: [0] });
      expect(ret.foo?.length).toBe(1);

      ret = assignDeep({ foo: '1,2,3' }, { foo: [1, 2, 3] });
      expect(typeof ret.foo !== 'string').toBeTruthy();

      ret = assignDeep({ foo: 'bar' }, { foo: null });
      expect(typeof ret.foo !== 'undefined').toBeTruthy();

      const obj = { foo: null };
      assignDeep(obj, { foo: 'notnull' });
      expect(obj.foo).toBe('notnull');

      const func: { (): void; key?: string } = () => {};
      assignDeep(func, { key: 'value' });
      expect(func.key).toBe('value');

      const defaults = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
      const defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
      const options1 = { xnumber2: 1, xstring2: 'x' };
      const options1Copy = { xnumber2: 1, xstring2: 'x' };
      const options2 = { xstring2: 'xx', xxx: 'newstringx' };
      const options2Copy = { xstring2: 'xx', xxx: 'newstringx' };
      const merged2 = {
        xnumber1: 5,
        xnumber2: 1,
        xstring1: 'peter',
        xstring2: 'xx',
        xxx: 'newstringx',
      };

      settings = assignDeep({}, defaults, options1, options2);
      expect(settings).toEqual(merged2);
      expect(defaults).toEqual(defaultsCopy);
      expect(options1).toEqual(options1Copy);
      expect(options2).toEqual(options2Copy);

      expect(assignDeep('', { foo: 1 })).toEqual({ foo: 1 });
      expect(assignDeep(null, { foo: null, deep: { foo: null } })).toEqual({
        foo: null,
        deep: { foo: null },
      });
      expect(assignDeep(12, { foo: 1, deep: { foo: null, text: '' } })).toEqual({
        foo: 1,
        deep: { foo: null, text: '' },
      });
    });

    test('undefined values', () => {
      const filled: Deep = {
        foo: {
          bar: true,
          baz: true,
        },
        foo2: document,
      };

      expect(assignDeep({}, filled, { foo: undefined })).toEqual({
        ...filled,
        foo: undefined,
      });
    });
  });

  describe('removeUndefinedProperties', () => {
    test('not deep', () => {
      const input = { a: undefined, array: [1, 2, 3, undefined], deep: { b: undefined } };
      const result = removeUndefinedProperties(input);

      expect(result).not.toBe(input);
      expect(result).toEqual({ array: [1, 2, 3, undefined], deep: { b: undefined } });
      expect(input).toEqual({ a: undefined, array: [1, 2, 3, undefined], deep: { b: undefined } });
    });

    test('deep', () => {
      const input = { a: undefined, array: [1, 2, 3, undefined], deep: { b: undefined } };
      const result = removeUndefinedProperties(input, true);

      expect(result).not.toBe(input);
      expect(result).toEqual({ array: [1, 2, 3, undefined], deep: {} });
      expect(input).toEqual({ a: undefined, array: [1, 2, 3, undefined], deep: { b: undefined } });
    });
  });

  describe('keys', () => {
    test('correct amount of keys', () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      expect(keys(obj)).toEqual(Object.keys(obj));
    });

    test('empty array if object null or undefined', () => {
      expect(keys(undefined)).toEqual([]);
      expect(keys(null)).toEqual([]);
    });
  });

  describe('isEmptyObject', () => {
    test('empty object is empty', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    test('filled object is not empty', () => {
      expect(isEmptyObject({ a: 1, b: 2 })).toBe(false);
    });

    test('created object is empty', () => {
      expect(isEmptyObject(Object.create(null))).toBe(true);
    });
  });

  test('hasOwnProperty', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };
    expect(hasOwnProperty(obj, 'a')).toBe(true);
    expect(hasOwnProperty(obj, 'b')).toBe(true);
    expect(hasOwnProperty(obj, 'c')).toBe(true);
    expect(hasOwnProperty(obj, 'd')).toBe(false);
  });
});
