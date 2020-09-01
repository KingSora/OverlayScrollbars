import { extend, keys, hasOwnProperty } from 'support/utils/object';
import { isPlainObject } from 'support/utils/types';

describe('object utilities', () => {
  // https://github.com/jquery/jquery/blob/master/test/unit/core.js#L965
  describe('extend', () => {
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
      const merged: Settings = { xnumber1: 5, xnumber2: 1, xstring1: 'peter', xstring2: 'x', xxx: 'newstring' };

      extend(settings, options);
      expect(settings).toEqual(merged);
      expect(options).toEqual(optionsCopy);

      extend(settings, null, options);
      expect(settings).toEqual(merged);
      expect(options).toEqual(optionsCopy);

      const deep1: Deep = { foo: { bar: true } };
      const deep2: Deep = { foo: { baz: true }, foo2: document };
      const deep2copy: Deep = { foo: { baz: true }, foo2: document };
      const deepmerged: Deep = { foo: { bar: true, baz: true }, foo2: document };

      extend(deep1, deep2);
      expect(deep1.foo).toEqual(deepmerged.foo);
      expect(deep2.foo).toEqual(deep2copy.foo);
      expect(deep1.foo2).toBe(document);

      const arr = [1, 2, 3];
      const nestedArray: NestedArray = { arr };

      expect(extend({}, nestedArray).arr).not.toBe(arr);
      expect(Array.isArray(extend({ arr: {} }, nestedArray).arr)).toBeTruthy();
      expect(Array.isArray(extend({ arr: {} }, nestedArray).arr)).toBeTruthy();
      expect(isPlainObject(extend({ arr }, { arr: {} }).arr)).toBeTruthy();

      let empty: { foo?: any } = {};
      const optionsWithLength = { foo: { length: -1 } };

      extend(empty, optionsWithLength);
      expect(empty.foo).toEqual(optionsWithLength.foo);

      empty = {};
      const optionsWithDate = { foo: { date: new Date() } };

      extend(empty, optionsWithDate);
      expect(empty.foo).toEqual(optionsWithDate.foo);

      /** @constructor */
      const MyKlass = function () {};
      // @ts-ignore
      const customObject = new MyKlass();
      const optionsWithCustomObject = { foo: { date: customObject } };
      empty = {};

      extend(empty, optionsWithCustomObject);
      expect(empty.foo && empty.foo.date === customObject).toBeTruthy();

      // Makes the class a little more realistic
      MyKlass.prototype = { someMethod() {} };
      empty = {};

      extend(empty, optionsWithCustomObject);
      expect(empty.foo && empty.foo.date === customObject).toBeTruthy();

      const MyNumber = Number;

      let ret: any = extend({ foo: 4 }, { foo: new MyNumber(5) });
      expect(parseInt(ret.foo?.toString() as string, 10) === 5).toBeTruthy();

      let nullUndef = extend({}, options, { xnumber2: null });
      expect(nullUndef.xnumber2).toBe(null);

      // @ts-ignore
      nullUndef = extend({}, options, { xnumber2: undefined });
      expect(nullUndef.xnumber2).toBe(options.xnumber2);

      // @ts-ignore
      nullUndef = extend({}, options, { xnumber0: null });
      expect(nullUndef.xnumber0).toBe(null);

      const target = {};
      const recursive = { foo: target, bar: 5 };

      extend(target, recursive);
      expect(target).toEqual({ bar: 5 });

      ret = extend({ foo: [] }, { foo: [0] });
      expect(ret.foo?.length).toBe(1);

      ret = extend({ foo: '1,2,3' }, { foo: [1, 2, 3] });
      expect(typeof ret.foo !== 'string').toBeTruthy();

      ret = extend({ foo: 'bar' }, { foo: null });
      expect(typeof ret.foo !== 'undefined').toBeTruthy();

      const obj = { foo: null };
      extend(obj, { foo: 'notnull' });
      expect(obj.foo).toBe('notnull');

      const func: { (): void; key?: string } = () => {};
      extend(func, { key: 'value' });
      expect(func.key).toBe('value');

      const defaults = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
      const defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
      const options1 = { xnumber2: 1, xstring2: 'x' };
      const options1Copy = { xnumber2: 1, xstring2: 'x' };
      const options2 = { xstring2: 'xx', xxx: 'newstringx' };
      const options2Copy = { xstring2: 'xx', xxx: 'newstringx' };
      const merged2 = { xnumber1: 5, xnumber2: 1, xstring1: 'peter', xstring2: 'xx', xxx: 'newstringx' };

      settings = extend({}, defaults, options1, options2);
      expect(settings).toEqual(merged2);
      expect(defaults).toEqual(defaultsCopy);
      expect(options1).toEqual(options1Copy);
      expect(options2).toEqual(options2Copy);

      expect(extend('', { foo: 1 })).toEqual({ foo: 1 });
      expect(extend(null, { foo: null, deep: { foo: null } })).toEqual({ foo: null, deep: { foo: null } });
      expect(extend(12, { foo: 1, deep: { foo: null, text: '' } })).toEqual({ foo: 1, deep: { foo: null, text: '' } });
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
