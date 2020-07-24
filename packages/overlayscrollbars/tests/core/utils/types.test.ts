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
  isEmptyObject,
  isHTMLElement,
} from 'core/utils/types';

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
};

const testTypeFn = (typeFunc: Function, expectedTypeNameValueResultMap: any) => {
  Object.keys(typeNameValueMap).forEach((comparisonKey) => {
    const comparisonValue = typeNameValueMap[comparisonKey];
    const result = typeFunc(comparisonValue);
    if (expectedTypeNameValueResultMap.hasOwnProperty(comparisonKey)) {
      const todoComparisonValue = expectedTypeNameValueResultMap[comparisonKey];
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
      objectCreate: true,
      arrayLikeObject: true,
    });
  });

  test('isEmptyObject', () => {
    testTypeFn(isEmptyObject, {
      objectEmpty: true,
      objectCreate: true,
      arrayEmpty: true,

      newNumber: true,
      newBoolean: true,
      newFunction: true,
      newArray: true,

      null: true,
      undefined: true,
      booleanTrue: true,
      booleanFalse: true,
      void0: true,
      number: true,
      infinity: true,
      functionConstructor: true,
      function: true,
      functionAsync: true,
      functionArrow: true,
      functionArrowAsync: true,
    });
  });

  test('isHTMLElement', () => {
    const temp = window.HTMLElement;

    testTypeFn(isHTMLElement, {
      body: true,
    });
    Array.from(document.querySelectorAll('*')).forEach((elm) => {
      expect(isHTMLElement(elm)).toBeTruthy();
    });

    delete window.HTMLElement;
    // @ts-ignore
    window.HTMLElement = null;

    testTypeFn(isHTMLElement, {
      body: true,
    });
    Array.from(document.querySelectorAll('*')).forEach((elm) => {
      expect(isHTMLElement(elm)).toBeTruthy();
    });

    window.HTMLElement = temp;
  });
});
