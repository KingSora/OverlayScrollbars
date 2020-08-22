import { each, indexOf } from 'support/utils/array';

describe('array utilities', () => {
  describe('each', () => {
    describe('each through Array', () => {
      test('returns input', () => {
        const arr = [1, 2, 3];
        expect(each(arr, () => {})).toBe(arr);
      });

      test('correct times', () => {
        const arr = [1, 2, 3];
        const eachCallback = jest.fn();

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
        const testFunc = jest.fn();

        each(arr, () => {
          testFunc();
          return false;
        });

        expect(testFunc).toBeCalledTimes(1);
      });

      test('return true equals continue', () => {
        const arr = [1, 2, 3];
        const testFunc = jest.fn();

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
        const eachCallback = jest.fn();

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
          expect(value).toBe(obj[key]);
          expect(obj).toBe(src);
        });
      });

      test('return false equals break', () => {
        const obj = {
          a: 1,
          b: 2,
          c: 3,
        };
        const testFunc = jest.fn();

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
        const testFunc = jest.fn();
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
        const eachCallback = jest.fn();

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
        const testFunc = jest.fn();

        each(arrLikeObj, () => {
          testFunc();
          return false;
        });

        expect(testFunc).toBeCalledTimes(1);
      });

      test('return true equals continue', () => {
        const arrLikeObj = document.querySelectorAll('*');
        const testFunc = jest.fn();

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

  test('indexOf', () => {
    const idx = indexOf([1, 2, 3], 2);
    expect(idx).toBe(1);
  });
});
