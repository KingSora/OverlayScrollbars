import { createCache } from 'support/cache';

const createUpdater = <T>(updaterReturn: (i: number) => T) => {
  const fn = jest.fn();
  let index = 0;
  const update = (curr?: T, prev?: T): T => {
    fn(curr, prev);
    index += 1;
    return updaterReturn(index);
  };

  return [fn, update];
};

describe('cache', () => {
  describe('cache with cacheUpdateInfo object', () => {
    test('creates and updates simple cache', () => {
      interface Test {
        number: number;
        boolean: boolean;
        string: string;
        object: {};
      }
      const [updateNumberFn, updateNumber] = createUpdater<number>((i) => i);
      const [updateBooleanFn, updateBoolean] = createUpdater<boolean>((i) => !!(i % 2));
      const [updateStringFn, updateString] = createUpdater<string>((i) => `${i}`);
      const [updateObjFn, updateObj] = createUpdater<object>((i) => ({ [i]: i }));

      const updateCache = createCache<Test>({
        number: updateNumber,
        boolean: updateBoolean,
        string: updateString,
        object: updateObj,
      });

      expect(updateCache('number').number._value).toBe(1);
      expect(updateNumberFn).toHaveBeenCalledTimes(1);
      expect(updateNumberFn).toHaveBeenLastCalledWith(undefined, undefined);

      expect(updateCache('number').number._value).toBe(2);
      expect(updateNumberFn).toHaveBeenCalledTimes(2);
      expect(updateNumberFn).toHaveBeenLastCalledWith(1, undefined);

      expect(updateCache('number').number._value).toBe(3);
      expect(updateNumberFn).toHaveBeenCalledTimes(3);
      expect(updateNumberFn).toHaveBeenLastCalledWith(2, 1);

      let { string, boolean, object, number } = updateCache('number');
      expect(string._value).toBe(undefined);
      expect(string._changed).toBe(false);
      expect(boolean._value).toBe(undefined);
      expect(boolean._changed).toBe(false);
      expect(object._value).toBe(undefined);
      expect(object._changed).toBe(false);
      expect(number._value).toBe(4);
      expect(number._changed).toBe(true);

      expect(updateBooleanFn).not.toHaveBeenCalled();
      expect(updateStringFn).not.toHaveBeenCalled();
      expect(updateObjFn).not.toHaveBeenCalled();

      ({ string, boolean, object, number } = updateCache(['string', 'boolean', 'object']));
      expect(string._value).toBe('1');
      expect(string._changed).toBe(true);
      expect(boolean._value).toBe(!!(1 % 2));
      expect(boolean._changed).toBe(true);
      expect(object._value).toEqual({ 1: 1 });
      expect(object._changed).toEqual(true);
      expect(number._value).toBe(4);
      expect(number._changed).toBe(false);

      expect(updateBooleanFn).toHaveBeenCalledTimes(1);
      expect(updateBooleanFn).toHaveBeenLastCalledWith(undefined, undefined);

      expect(updateStringFn).toHaveBeenCalledTimes(1);
      expect(updateStringFn).toHaveBeenLastCalledWith(undefined, undefined);

      expect(updateObjFn).toHaveBeenCalledTimes(1);
      expect(updateObjFn).toHaveBeenLastCalledWith(undefined, undefined);

      updateCache(['string', 'boolean', 'object']);
      expect(updateBooleanFn).toHaveBeenCalledTimes(2);
      expect(updateBooleanFn).toHaveBeenLastCalledWith(!!(1 % 2), undefined);

      expect(updateStringFn).toHaveBeenCalledTimes(2);
      expect(updateStringFn).toHaveBeenLastCalledWith('1', undefined);

      expect(updateObjFn).toHaveBeenCalledTimes(2);
      expect(updateObjFn).toHaveBeenLastCalledWith({ 1: 1 }, undefined);

      updateCache(['string', 'boolean', 'object']);
      expect(updateBooleanFn).toHaveBeenCalledTimes(3);
      expect(updateBooleanFn).toHaveBeenLastCalledWith(!!(2 % 2), !!(1 % 2));

      expect(updateStringFn).toHaveBeenCalledTimes(3);
      expect(updateStringFn).toHaveBeenLastCalledWith('2', '1');

      expect(updateObjFn).toHaveBeenCalledTimes(3);
      expect(updateObjFn).toHaveBeenLastCalledWith({ 2: 2 }, { 1: 1 });

      updateCache(['string', 'boolean', 'object']);
      ({ string, boolean, object, number } = updateCache());
      expect(string._value).toBe('5');
      expect(string._changed).toBe(true);
      expect(boolean._value).toBe(!!(5 % 2));
      expect(boolean._changed).toBe(true);
      expect(object._value).toEqual({ 5: 5 });
      expect(object._changed).toEqual(true);
      expect(number._value).toBe(5);
      expect(number._changed).toBe(true);

      expect(updateBooleanFn).toHaveBeenCalledTimes(5);
      expect(updateStringFn).toHaveBeenCalledTimes(5);
      expect(updateObjFn).toHaveBeenCalledTimes(5);
      expect(updateNumberFn).toHaveBeenCalledTimes(5);
    });

    test('doesnt update if nothing changes with primitives', () => {
      const [updateNumberFn, updateNumber] = createUpdater<number>(() => 0);
      const updateCache = createCache({
        number: updateNumber,
      });

      let { _value, _changed } = updateCache('number').number;
      expect(_value).toBe(0);
      expect(_changed).toBe(true);
      expect(updateNumberFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(0);
      expect(_changed).toBe(false);
      expect(updateNumberFn).toHaveBeenLastCalledWith(0, undefined);

      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(0);
      expect(_changed).toBe(false);
      expect(updateNumberFn).toHaveBeenLastCalledWith(0, 0);

      const changed = updateCache('number');
      expect(Object.prototype.hasOwnProperty.call(changed, 'changed')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(changed, 'number')).toBe(true);
    });

    test('doesnt update if nothing changes with non primitives', () => {
      const constObj = { a: 0, b: 0 };
      const [updateConstObjFn, updateConstObj] = createUpdater<{ a: number; b: number }>(() => constObj);
      const [updateSimilarObjFn, updateSimilarObj] = createUpdater<{ a: number; b: number }>(() => ({ ...constObj }));
      const [updateComparisonObjFn, updateComparisonObj] = createUpdater<{ a: number; b: number }>(() => ({ ...constObj }));
      const updateCache = createCache({
        constObj: updateConstObj,
        similarObj: updateSimilarObj,
        comparisonObj: [
          updateComparisonObj,
          (a?: { a: number; b: number }, b?: { a: number; b: number }): boolean => !!(a && b && a.a === b.a && a.b === b.b),
        ],
      });

      let { _value, _changed } = updateCache('constObj').constObj;
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(true);
      expect(updateConstObjFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('constObj').constObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(false);
      expect(updateConstObjFn).toHaveBeenLastCalledWith(constObj, undefined);

      ({ _value, _changed } = updateCache('constObj').constObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(false);
      expect(updateConstObjFn).toHaveBeenLastCalledWith(constObj, constObj);

      ({ _value, _changed } = updateCache('similarObj').similarObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(true);
      expect(updateSimilarObjFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('similarObj').similarObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(true);
      expect(updateSimilarObjFn).toHaveBeenLastCalledWith(constObj, undefined);

      ({ _value, _changed } = updateCache('similarObj').similarObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(true);
      expect(updateSimilarObjFn).toHaveBeenLastCalledWith(constObj, constObj);

      ({ _value, _changed } = updateCache('comparisonObj').comparisonObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(true);
      expect(updateComparisonObjFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('comparisonObj').comparisonObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(false);
      expect(updateComparisonObjFn).toHaveBeenLastCalledWith(constObj, undefined);

      ({ _value, _changed } = updateCache('comparisonObj').comparisonObj);
      expect(_value).toEqual(constObj);
      expect(_changed).toBe(false);
      expect(updateComparisonObjFn).toHaveBeenLastCalledWith(constObj, constObj);

      const result = updateCache();
      expect(Object.prototype.hasOwnProperty.call(result, 'constObj')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(result, 'similarObj')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(result, 'comparisonObj')).toBe(true);
    });

    test('updates definitely with force', () => {
      const [updateNumberFn, updateNumber] = createUpdater<number>(() => 0);
      const [, updateString] = createUpdater<number>(() => 0);
      const updateCache = createCache({
        number: updateNumber,
        string: updateString,
      });

      let { _value, _changed } = updateCache('number', true).number;
      expect(_value).toBe(0);
      expect(_changed).toBe(true);
      expect(updateNumberFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('number', true).number);
      expect(_value).toBe(0);
      expect(_changed).toBe(true);
      expect(updateNumberFn).toHaveBeenLastCalledWith(0, undefined);

      ({ _value, _changed } = updateCache('number', true).number);
      expect(_value).toBe(0);
      expect(_changed).toBe(true);
      expect(updateNumberFn).toHaveBeenLastCalledWith(0, 0);

      let { number, string } = updateCache('number', true);
      expect(number._changed).toBe(true);
      expect(string._changed).toBe(false);

      ({ number, string } = updateCache(['number', 'string'], true));
      expect(number._changed).toBe(true);
      expect(string._changed).toBe(true);

      ({ number, string } = updateCache('string', true));
      expect(number._changed).toBe(false);
      expect(string._changed).toBe(true);
    });

    test('custom comparison on primitves', () => {
      const [updateStringFn, updateString] = createUpdater<string>(() => 'hi');
      const [updateNumberFn, updateNumber] = createUpdater<number>((i) => i);
      const updateCache = createCache({
        string: [updateString, () => false],
        number: [updateNumber, () => true],
      });

      let { _value, _changed } = updateCache('string').string;
      expect(_value).toBe('hi');
      expect(_changed).toBe(true);
      expect(updateStringFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('string').string);
      expect(_value).toBe('hi');
      expect(_changed).toBe(true);
      expect(updateStringFn).toHaveBeenLastCalledWith('hi', undefined);

      ({ _value, _changed } = updateCache('string').string);
      expect(_value).toBe('hi');
      expect(_changed).toBe(true);
      expect(updateStringFn).toHaveBeenLastCalledWith('hi', 'hi');

      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(1);
      expect(_changed).toBe(false);
      expect(updateNumberFn).toHaveBeenLastCalledWith(undefined, undefined);

      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(2);
      expect(_changed).toBe(false);
      expect(updateNumberFn).toHaveBeenLastCalledWith(1, undefined);

      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(3);
      expect(_changed).toBe(false);
      expect(updateNumberFn).toHaveBeenLastCalledWith(2, 1);
    });

    test('updates all entries with null or undefined as argument', () => {
      const [updateNumberFn, updateNumber] = createUpdater<number>((i) => i);
      const [updateNumberFn2, updateNumber2] = createUpdater<number>((i) => i);
      const updateCache = createCache({
        number: updateNumber,
        number2: updateNumber2,
      });

      updateCache();
      expect(updateNumberFn).toHaveBeenLastCalledWith(undefined, undefined);
      expect(updateNumberFn2).toHaveBeenLastCalledWith(undefined, undefined);

      updateCache(null);
      expect(updateNumberFn).toHaveBeenLastCalledWith(1, undefined);
      expect(updateNumberFn2).toHaveBeenLastCalledWith(1, undefined);
    });
  });

  describe('cache with reference object', () => {
    test('creates and updates simple cache', () => {
      interface Test {
        number: number;
        boolean: boolean;
        string: string;
        object: {};
      }
      const refObj: Test = {
        number: 0,
        boolean: false,
        string: 'hi',
        object: {},
      };

      const updateCache = createCache<Test>(refObj, true);

      let { _value, _changed, _previous } = updateCache('number').number;
      expect(_value).toBe(0);
      expect(_changed).toBe(false);

      refObj.number = 1;
      ({ _value, _changed } = updateCache('number').number);
      expect(_value).toBe(1);
      expect(_changed).toBe(true);

      refObj.number = 2;
      ({ _value, _changed } = updateCache('string').number);
      expect(_value).toBe(1);
      expect(_changed).toBe(false);

      refObj.number = 3;
      ({ _value, _changed, _previous } = updateCache('number').number);
      expect(_value).toBe(3);
      expect(_previous).toBe(1);
      expect(_changed).toBe(true);

      let { number, boolean, string, object } = updateCache();
      expect(number._value).toBe(3);
      expect(number._changed).toBe(false);
      expect(boolean._value).toBe(false);
      expect(boolean._changed).toBe(false);
      expect(string._value).toBe('hi');
      expect(string._changed).toBe(false);
      expect(object._value).toEqual({});
      expect(object._changed).toBe(false);

      refObj.string = 'hi2';
      refObj.boolean = true;
      ({ number, boolean, string, object } = updateCache());
      expect(number._value).toBe(3);
      expect(number._changed).toBe(false);
      expect(boolean._value).toBe(true);
      expect(boolean._changed).toBe(true);
      expect(string._value).toBe('hi2');
      expect(string._changed).toBe(true);
      expect(object._value).toEqual({});
      expect(object._changed).toBe(false);

      ({ number, boolean, string, object } = updateCache(null, true));
      expect(number._value).toBe(3);
      expect(number._changed).toBe(true);
      expect(boolean._value).toBe(true);
      expect(boolean._changed).toBe(true);
      expect(string._value).toBe('hi2');
      expect(string._changed).toBe(true);
      expect(object._value).toEqual({});
      expect(object._changed).toBe(true);
    });
  });
});
