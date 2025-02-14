import { vi, describe, test, expect } from 'vitest';
import {
  push,
  each,
  from,
  inArray,
  concat,
  deduplicateArray,
  createOrKeepArray,
  runEachAndClear,
  isEmptyArray,
} from '../../../../src/support/utils/array';

describe('array utilities', () => {
  describe('push', () => {
    describe('single value', () => {
      test('string', () => {
        const arr: string[] = [];
        const item = 'hi there';

        expect(push(arr, item)).toBe(arr);

        expect(arr).toHaveLength(1);
        expect(arr[0]).toBe(item);
      });

      test('array like', () => {
        const arr: string[] = [];
        const item = ['tuple', 'elem'];

        expect(push(arr, item, true)).toBe(arr);

        expect(arr).toHaveLength(1);
        expect(arr[0]).toBe(item);
      });

      test('array like fake', () => {
        const arr: any[] = [];
        const item = { length: 2 };

        expect(push(arr, item)).toBe(arr);

        expect(arr).toHaveLength(1);
        expect(arr[0]).toBe(item);
      });
    });

    describe('multiple values', () => {
      test('string', () => {
        const arr: string[] = [];
        const items = 'hi there'.split('');

        expect(push(arr, items)).toBe(arr);

        expect(arr).toHaveLength(items.length);
        expect(arr).toEqual(items);
      });

      test('array', () => {
        const arr: string[] = [];
        const items = ['tuple', 'elem'];

        expect(push(arr, items)).toBe(arr);

        expect(arr).toHaveLength(2);
        expect(arr[0]).toBe('tuple');
        expect(arr[1]).toBe('elem');
      });

      test('array like', () => {
        const arr: string[] = [];
        const items = { 0: 'zero', 1: 'one', 2: 'two', length: 3 };

        expect(push(arr, items)).toBe(arr);

        expect(arr).toHaveLength(3);
        expect(arr[0]).toBe('zero');
        expect(arr[1]).toBe('one');
        expect(arr[2]).toBe('two');
      });

      test('array like query selector', () => {
        document.body.innerHTML = '<div><p>testtext<h1></h1></p><div></div></div>';
        const arr: Node[] = [];
        const items = document.querySelectorAll('*');

        expect(push(arr, items)).toBe(arr);

        expect(arr).not.toHaveLength(0);
        arr.forEach((node) => {
          expect(node instanceof window.Element).toBe(true);
        });
      });
    });
  });

  describe('each', () => {
    describe('each through Array', () => {
      test('returns input', () => {
        const arr = [1, 2, 3];
        expect(each(arr, () => {})).toBe(arr);
      });

      test('correct times', () => {
        const arr = [1, 2, 3];
        const eachCallback = vi.fn();

        each(arr, eachCallback);
        expect(eachCallback).toBeCalledTimes(arr.length);
      });

      test('correct callback values', () => {
        const arr = [1, 2, 3];
        each(arr, (value, index, src) => {
          expect(value).toBe(arr[index]);
          expect(arr).toBe(src);
        });
      });

      test('return false equals break', () => {
        const arr = [1, 2, 3];
        const testFunc = vi.fn();

        each(arr, () => {
          testFunc();
          return false;
        });

        expect(testFunc).toBeCalledTimes(1);
      });

      test('return true equals continue', () => {
        const arr = [1, 2, 3];
        const testFunc = vi.fn();

        each(arr, (value, index) => {
          if (index === 0) {
            return true;
          }
          testFunc();
        });

        expect(testFunc).toBeCalledTimes(arr.length - 1);
      });
    });

    describe('each through Object', () => {
      test('returns input', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        expect(each(obj, () => {})).toBe(obj);
      });

      test('correct times', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        const eachCallback = vi.fn();

        each(obj, eachCallback);
        expect(eachCallback).toBeCalledTimes(Object.keys(obj).length);
      });

      test('correct callback values', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        each(obj, (value, key, src) => {
          expect(value).toBe(obj[key as keyof typeof obj]);
          expect(obj).toBe(src);
        });
      });

      test('return false equals break', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        const testFunc = vi.fn();

        each(obj, () => {
          testFunc();
          return false;
        });

        expect(testFunc).toBeCalledTimes(1);
      });

      test('return true equals continue', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        const testFunc = vi.fn();
        let index = -1;

        each(obj, () => {
          index++;
          if (index === 0) {
            return true;
          }
          testFunc();
        });

        expect(testFunc).toBeCalledTimes(Object.keys(obj).length - 1);
      });
    });

    describe('each through ArrayLike Object', () => {
      test('returns input', () => {
        const arrLikeObj = document.querySelectorAll('*');
        expect(each(arrLikeObj, () => {})).toBe(arrLikeObj);
      });

      test('correct times', () => {
        const arrLikeObj = document.querySelectorAll('*');
        const eachCallback = vi.fn();

        each(arrLikeObj, eachCallback);
        expect(eachCallback).toBeCalledTimes(arrLikeObj.length);
      });

      test('correct callback values', () => {
        const arrLikeObj = document.querySelectorAll('*');
        each(arrLikeObj, (value, index, src) => {
          expect(value).toBe(arrLikeObj[index]);
          expect(src).toBe(arrLikeObj);
        });
      });

      test('return false equals break', () => {
        const arrLikeObj = document.querySelectorAll('*');
        const testFunc = vi.fn();

        each(arrLikeObj, () => {
          testFunc();
          return false;
        });

        expect(testFunc).toBeCalledTimes(1);
      });

      test('return true equals continue', () => {
        const arrLikeObj = document.querySelectorAll('*');
        const testFunc = vi.fn();

        each(arrLikeObj, (value, index) => {
          if (index === 0) {
            return true;
          }
          testFunc();
        });

        expect(testFunc).toBeCalledTimes(arrLikeObj.length - 1);
      });
    });
  });

  describe('from', () => {
    test('Array.from', () => {
      document.body.innerHTML = '<div></div><div></div><div></div>';
      const fromChildNodes = from(document.body.childNodes);
      expect(fromChildNodes).toEqual(Array.from(document.body.childNodes));
      document.body.innerHTML = '';
    });

    test('Array.from with Set', () => {
      const fromResult = from(new Set([1, 2, 3]));
      expect(fromResult).toEqual([1, 2, 3]);
    });
  });

  describe('runEachAndClear', () => {
    test('array', () => {
      const firstFn = vi.fn();
      const middleFn = vi.fn();
      const lastFn = vi.fn();
      const arr = [
        firstFn,
        false as const,
        null,
        undefined,
        middleFn,
        undefined,
        null,
        false as const,
        lastFn,
      ];
      runEachAndClear(arr, ['a', 'b', 'c', 'd'], true);
      runEachAndClear(arr, ['a', 'b', 'c', 'd']);

      expect(arr.length).toBe(0);

      expect(firstFn).toHaveBeenCalledTimes(2);
      expect(firstFn).toHaveBeenCalledWith('a', 'b', 'c', 'd');
      expect(middleFn).toHaveBeenCalledTimes(2);
      expect(middleFn).toHaveBeenCalledWith('a', 'b', 'c', 'd');
      expect(lastFn).toHaveBeenCalledTimes(2);
      expect(lastFn).toHaveBeenCalledWith('a', 'b', 'c', 'd');
    });
  });

  test('inArray', () => {
    expect(inArray([1, 2, 3], 2)).toBe(true);
    expect(inArray([1, 2, 3], 4)).toBe(false);
  });

  test('concat', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    expect(concat(a, b)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(a).toEqual([1, 2, 3]);
    expect(b).toEqual([4, 5, 6]);
  });

  test('deduplicateArray', () => {
    expect(deduplicateArray(['a', 'b', 'c', 'a'])).toHaveLength(3);
    expect(deduplicateArray(['a', 'a', 'a', 'a'])).toHaveLength(1);
    expect(Array.isArray(deduplicateArray([]))).toBe(true);
  });

  test('createOrKeepArray', () => {
    const arr = [1];
    const val = 1;

    expect(createOrKeepArray(arr)).toBe(arr);

    expect(createOrKeepArray(val)).not.toBe(arr);
    expect(createOrKeepArray(val)).toEqual(arr);

    expect(createOrKeepArray('abc')).toEqual(['abc']);
    expect(createOrKeepArray(document.querySelectorAll('*'))).toEqual(
      Array.from(document.querySelectorAll('*'))
    );
  });

  test('isEmptyArray', () => {
    expect(isEmptyArray([])).toBe(true);
    expect(isEmptyArray([1, 2, 3])).toBe(false);
    expect(isEmptyArray(null)).toBe(false);
  });
});
