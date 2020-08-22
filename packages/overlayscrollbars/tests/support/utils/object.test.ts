import { keys, hasOwnProperty } from 'support/utils/object';

describe('object utilities', () => {
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
