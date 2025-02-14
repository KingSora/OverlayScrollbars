import { describe, test, expect } from 'vitest';
import { createDOM } from '../../../../src/support/dom/create';
import {
  type,
  isNumber,
  isString,
  isBoolean,
  isFunction,
  isArray,
  isObject,
  isUndefined,
  isNull,
  isArrayLike,
  isPlainObject,
  isElement,
  isHTMLElement,
} from '../../../../src/support/utils/types';

const testfn = function () {};
const testfnAsync = async function () {};

const typeNameValueMap = {
  null: null,
  undefined,
  void0: void 0,
  infinity: Infinity,
  number: 0,
  string: '0',
  booleanTrue: true,
  booleanFalse: false,
  function: testfn,
  functionAsync: testfnAsync,
  functionArrow: () => {},
  functionArrowAsync: async () => {},
  functionConstructor: new (testfn as any)(),
  arrayEmpty: [],
  objectEmpty: {},
  array: [1, 2, 3],
  object: { a: 1, b: 2, c: 3 },
  objectCreate: Object.create(null),
  arrayLikeObject: { 0: 0, 1: 1, 2: 2, length: 3 },
  newNumber: new Number(0),
  newString: new String('0'),
  newBoolean: new Boolean(false),
  newFunction: new Function(''),
  newArray: [],
  document,
  window,
  body: document.body,
  querySelectorAll: document.querySelectorAll('*'),
  textNode: createDOM('<div>textnodehere</div>')[0].firstChild,
};

const testTypeFn = (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  typeFunc: Function,
  expectedTypeNameValueResultMap: Partial<Record<keyof typeof typeNameValueMap, boolean>>
) => {
  Object.keys(typeNameValueMap).forEach((comparisonKey) => {
    const comparisonValue = (typeNameValueMap as Record<string, any>)[comparisonKey];
    const result = typeFunc(comparisonValue);
    if (expectedTypeNameValueResultMap.hasOwnProperty(comparisonKey)) {
      const todoComparisonValue =
        expectedTypeNameValueResultMap[comparisonKey as keyof typeof typeNameValueMap];
      expect(result + comparisonKey).toBe(todoComparisonValue + comparisonKey);
    } else {
      expect(result + comparisonKey).toBe(false + comparisonKey);
    }
  });
};

describe('types', () => {
  test('type', () => {
    expect(type(undefined)).toBe('undefined');
    expect(type(null)).toBe('null');
    expect(type(true)).toBe('boolean');
    expect(type(new Boolean())).toBe('boolean');
    expect(type(3)).toBe('number');
    expect(type(new Number(3))).toBe('number');
    expect(type('test')).toBe('string');
    expect(type(new String('test'))).toBe('string');

    expect(type(function () {})).toBe('function');
    expect(type(() => {})).toBe('function');
    expect(type([])).toBe('array');
    expect(type([])).toBe('array');
    expect(type(new Date())).toBe('date');
    expect(type(new Error())).toBe('error');
    expect(type(Symbol())).toBe('symbol');
    expect(type(Object(Symbol()))).toBe('symbol');
    expect(type(/test/)).toBe('regexp');
  });

  test('isNumber', () => {
    testTypeFn(isNumber, {
      number: true,
      infinity: true,
      newNumber: false, // new Number() not a number is ok
    });
  });

  test('isString', () => {
    testTypeFn(isString, {
      string: true,
      newString: false, // new String() not a string is ok
    });
  });

  test('isBoolean', () => {
    testTypeFn(isBoolean, {
      booleanTrue: true,
      booleanFalse: true,
      newBoolean: false, // new Boolean() not a boolean is ok
    });
  });

  test('isFunction', () => {
    testTypeFn(isFunction, {
      function: true,
      functionAsync: true,
      functionArrow: true,
      functionArrowAsync: true,
      newFunction: true,
    });
  });

  test('isArray', () => {
    testTypeFn(isArray, {
      array: true,
      arrayEmpty: true,
      newArray: true,
    });
  });

  test('isObject', () => {
    testTypeFn(isObject, {
      object: true,
      objectEmpty: true,
      objectCreate: true,
      document: true,
      window: true,
      body: true,
      textNode: true,
      querySelectorAll: true,
      functionConstructor: true,
      arrayLikeObject: true,

      // is ok since nobody does this
      newNumber: true,
      newString: true,
      newBoolean: true,
    });
  });

  test('isUndefined', () => {
    testTypeFn(isUndefined, {
      undefined: true,
      void0: true,
    });
  });

  test('isNull', () => {
    testTypeFn(isNull, {
      null: true,
    });
  });

  test('isArrayLike', () => {
    testTypeFn(isArrayLike, {
      array: true,
      arrayEmpty: true,
      arrayLikeObject: true,
      querySelectorAll: true,
      string: true,
      newString: true,
      newArray: true,
      // is ok I guess...
      window: true,
    });
  });

  test('isPlainObject', () => {
    testTypeFn(isPlainObject, {
      object: true,
      objectEmpty: true,
      objectCreate: false, // should be true for correctness but can stay false for smaller bundle size
      arrayLikeObject: true,
      // is ok I guess...
      window: true,
    });
  });

  test('isElement', () => {
    testTypeFn(isElement, {
      body: true,
    });
    Array.from(document.querySelectorAll('*')).forEach((elm) => {
      expect(isElement(elm)).toBeTruthy();
    });
  });

  test('isHTMLElement', () => {
    testTypeFn(isHTMLElement, {
      body: true,
    });
    Array.from(document.querySelectorAll('*')).forEach((elm) => {
      expect(isHTMLElement(elm)).toBeTruthy();
    });
  });
});
