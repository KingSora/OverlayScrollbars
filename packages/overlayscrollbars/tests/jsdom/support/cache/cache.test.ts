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
  describe('createCache', () => {
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

      expect(updateCache('number').number).toBe(1);
      expect(updateNumberFn).toHaveBeenCalledTimes(1);
      expect(updateNumberFn).toHaveBeenCalledWith(undefined, undefined);

      expect(updateCache('number').number).toBe(2);
      expect(updateNumberFn).toHaveBeenCalledTimes(2);
      expect(updateNumberFn).toHaveBeenCalledWith(1, undefined);

      expect(updateCache('number').number).toBe(3);
      expect(updateNumberFn).toHaveBeenCalledTimes(3);
      expect(updateNumberFn).toHaveBeenCalledWith(2, 1);

      let { string, boolean, object, number } = updateCache('number');
      expect(string).toBe(undefined);
      expect(boolean).toBe(undefined);
      expect(object).toBe(undefined);
      expect(number).toBe(4);

      expect(updateBooleanFn).not.toHaveBeenCalled();
      expect(updateStringFn).not.toHaveBeenCalled();
      expect(updateObjFn).not.toHaveBeenCalled();

      ({ string, boolean, object, number } = updateCache(['string', 'boolean', 'object']));
      expect(string).toBe('1');
      expect(boolean).toBe(!!(1 % 2));
      expect(object).toEqual({ 1: 1 });
      expect(number).toBe(undefined);

      expect(updateBooleanFn).toHaveBeenCalledTimes(1);
      expect(updateBooleanFn).toHaveBeenCalledWith(undefined, undefined);

      expect(updateStringFn).toHaveBeenCalledTimes(1);
      expect(updateStringFn).toHaveBeenCalledWith(undefined, undefined);

      expect(updateObjFn).toHaveBeenCalledTimes(1);
      expect(updateObjFn).toHaveBeenCalledWith(undefined, undefined);

      updateCache(['string', 'boolean', 'object']);
      expect(updateBooleanFn).toHaveBeenCalledTimes(2);
      expect(updateBooleanFn).toHaveBeenCalledWith(!!(1 % 2), undefined);

      expect(updateStringFn).toHaveBeenCalledTimes(2);
      expect(updateStringFn).toHaveBeenCalledWith('1', undefined);

      expect(updateObjFn).toHaveBeenCalledTimes(2);
      expect(updateObjFn).toHaveBeenCalledWith({ 1: 1 }, undefined);

      updateCache(['string', 'boolean', 'object']);
      expect(updateBooleanFn).toHaveBeenCalledTimes(3);
      expect(updateBooleanFn).toHaveBeenCalledWith(!!(2 % 2), !!(1 % 2));

      expect(updateStringFn).toHaveBeenCalledTimes(3);
      expect(updateStringFn).toHaveBeenCalledWith('2', '1');

      expect(updateObjFn).toHaveBeenCalledTimes(3);
      expect(updateObjFn).toHaveBeenCalledWith({ 2: 2 }, { 1: 1 });

      updateCache(['string', 'boolean', 'object']);
      ({ string, boolean, object, number } = updateCache());
      expect(string).toBe('5');
      expect(boolean).toBe(!!(5 % 2));
      expect(object).toEqual({ 5: 5 });
      expect(number).toBe(5);

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

      expect(updateCache('number').number).toBe(0);
      expect(updateNumberFn).toHaveBeenCalledWith(undefined, undefined);

      expect(updateCache('number').number).toBe(undefined);
      expect(updateNumberFn).toHaveBeenCalledWith(0, undefined);

      expect(updateCache('number').number).toBe(undefined);
      expect(updateNumberFn).toHaveBeenCalledWith(0, 0);

      const changed = updateCache('number');
      expect(Object.prototype.hasOwnProperty.call(changed, 'changed')).toBe(false);
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

      expect(updateCache('constObj').constObj).toBe(constObj);
      expect(updateConstObjFn).toHaveBeenCalledWith(undefined, undefined);
      expect(updateCache('constObj').constObj).toBe(undefined);
      expect(updateConstObjFn).toHaveBeenCalledWith(constObj, undefined);
      expect(updateCache('constObj').constObj).toBe(undefined);
      expect(updateConstObjFn).toHaveBeenCalledWith(constObj, constObj);
      expect(Object.prototype.hasOwnProperty.call(updateCache('constObj'), 'constObj')).toBe(false);

      expect(updateCache('similarObj').similarObj).toEqual(constObj);
      expect(updateSimilarObjFn).toHaveBeenCalledWith(undefined, undefined);
      expect(updateCache('similarObj').similarObj).toEqual(constObj);
      expect(updateSimilarObjFn).toHaveBeenCalledWith(constObj, undefined);
      expect(updateCache('similarObj').similarObj).toEqual(constObj);
      expect(updateSimilarObjFn).toHaveBeenCalledWith(constObj, constObj);
      expect(Object.prototype.hasOwnProperty.call(updateCache('similarObj'), 'similarObj')).toBe(true);

      expect(updateCache('comparisonObj').comparisonObj).toEqual(constObj);
      expect(updateComparisonObjFn).toHaveBeenCalledWith(undefined, undefined);
      expect(updateCache('comparisonObj').comparisonObj).toBe(undefined);
      expect(updateComparisonObjFn).toHaveBeenCalledWith(constObj, undefined);
      expect(updateCache('comparisonObj').comparisonObj).toBe(undefined);
      expect(updateComparisonObjFn).toHaveBeenCalledWith(constObj, constObj);
      expect(Object.prototype.hasOwnProperty.call(updateCache('comparisonObj'), 'comparisonObj')).toBe(false);
    });

    test('updates definitely with force', () => {
      const [updateNumberFn, updateNumber] = createUpdater<number>(() => 0);
      const updateCache = createCache({
        number: updateNumber,
      });

      expect(updateCache('number', true).number).toBe(0);
      expect(updateNumberFn).toHaveBeenCalledWith(undefined, undefined);

      expect(updateCache('number', true).number).toBe(0);
      expect(updateNumberFn).toHaveBeenCalledWith(0, undefined);

      expect(updateCache('number', true).number).toBe(0);
      expect(updateNumberFn).toHaveBeenCalledWith(0, 0);
    });

    test('custom comparison on primitves', () => {
      const [updateStringFn, updateString] = createUpdater<string>(() => 'hi');
      const [updateNumberFn, updateNumber] = createUpdater<number>((i) => i);
      const updateCache = createCache({
        string: [updateString, () => false],
        number: [updateNumber, () => true],
      });

      expect(updateCache('string').string).toBe('hi');
      expect(updateStringFn).toHaveBeenCalledWith(undefined, undefined);
      expect(updateCache('string').string).toBe('hi');
      expect(updateStringFn).toHaveBeenCalledWith('hi', undefined);
      expect(updateCache('string').string).toBe('hi');
      expect(updateStringFn).toHaveBeenCalledWith('hi', 'hi');
      expect(Object.prototype.hasOwnProperty.call(updateCache('string'), 'string')).toBe(true);

      expect(updateCache('number').number).toBe(undefined);
      expect(updateNumberFn).toHaveBeenCalledWith(undefined, undefined);
      expect(updateCache('number').number).toBe(undefined);
      expect(updateNumberFn).toHaveBeenCalledWith(1, undefined);
      expect(updateCache('number').number).toBe(undefined);
      expect(updateNumberFn).toHaveBeenCalledWith(2, 1);
      expect(Object.prototype.hasOwnProperty.call(updateCache('number'), 'number')).toBe(false);
    });
  });
});
