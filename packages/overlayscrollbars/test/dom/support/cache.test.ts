import { vi, describe, test, expect } from 'vitest';
import { createCache } from '../../../src/support/cache';

const createUpdater = <T>(updaterReturn: (i: number) => T) => {
  let index = 0;
  const updater = vi.fn((): T => {
    index += 1;
    return updaterReturn(index);
  });

  return updater;
};

describe('cache', () => {
  test('creates and updates cache', () => {
    const updater = createUpdater((i) => `${i}`);
    const _initialValue = '';
    const [updateCache, getCurrentCache] = createCache(
      {
        _initialValue,
      },
      updater
    );

    let [value, changed, previous] = updateCache();
    expect([value, false, previous]).toEqual(getCurrentCache());
    expect(updater).toHaveBeenLastCalledWith(_initialValue, undefined);
    expect(value).toBe('1');
    expect(previous).toBe(_initialValue);
    expect(changed).toBe(true);

    [value, changed, previous] = updateCache();
    expect([value, false, previous]).toEqual(getCurrentCache());
    expect(updater).toHaveBeenLastCalledWith('1', _initialValue);
    expect(value).toBe('2');
    expect(previous).toBe('1');
    expect(changed).toBe(true);
  });

  describe('contextual cache', () => {
    test('creates and updates contextual cache', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const _initialValue = false;
      const updater = (context: ContextObj) => context!.test === 'test' || context!.even % 2 === 0;
      const [updateCache, getCurrentCache] = createCache({ _initialValue });
      const firstCtx = { test: 'test', even: 2 };

      let [value, changed, previous] = updateCache(updater(firstCtx));
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(true);
      expect(previous).toBe(_initialValue);
      expect(changed).toBe(true);
      expect([value, false, previous]).toEqual(getCurrentCache());

      [value, changed, previous] = updateCache(updater(firstCtx));
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(true);
      expect(previous).toBe(_initialValue);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = updateCache(updater(scndCtx));
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(false);
      expect(previous).toBe(true);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(updater(scndCtx));
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(false);
      expect(previous).toBe(true);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache(updater(scndCtx), true);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(false);
      expect(previous).toBe(false);
      expect(changed).toBe(true);
    });

    test('creates and updates contextual cache with direct passing', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const _initialValue = undefined;
      const firstCtx = { test: 'test', even: 2 };
      const [updateCache] = createCache<ContextObj | undefined>({
        _initialValue,
      });

      let [value, changed, previous] = updateCache(firstCtx);
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(firstCtx);
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = updateCache(scndCtx);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(scndCtx);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache(scndCtx, true);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(true);
    });
  });

  describe('equal', () => {
    test('with equal always true', () => {
      const updater = createUpdater<number | undefined>((i) => i);
      const [updateCache, getCurrentCache] = createCache<number | undefined>(
        {
          _initialValue: undefined,
          _equal: () => true,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe(undefined);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe(undefined);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('with equal always false', () => {
      const updater = createUpdater<number | undefined>(() => 1);
      const [updateCache, getCurrentCache] = createCache<number | undefined>(
        {
          _initialValue: undefined,
          _equal: () => false,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(1, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(1);
      expect(changed).toBe(true);
    });

    test('with object equal', () => {
      const updater = createUpdater((i) => ({ a: i, b: i + 1 }));
      const [updateCache] = createCache(
        {
          _initialValue: undefined,
          _equal: (a, b) => a?.a === b?.a && a?.b === b?.b,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toEqual({ a: 1, b: 2 });
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith({ a: 1, b: 2 }, undefined);
      expect(value).toEqual({ a: 2, b: 3 });
      expect(previous).toEqual({ a: 1, b: 2 });
      expect(changed).toBe(true);
    });
  });

  describe('inital value', () => {
    test('creates and updates cache with initialValue', () => {
      const updater = createUpdater((i) => i);
      const [updateCache, getCurrentCache] = createCache<number>({ _initialValue: 0 }, updater);

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(0, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(0);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(1, 0);
      expect(value).toBe(2);
      expect(previous).toBe(1);
      expect(changed).toBe(true);
    });

    test('creates and updates cache with initialValue and equal', () => {
      const obj = { a: -1, b: -1 };
      const updater = createUpdater((i) => ({ a: i, b: i + 1 }));
      const [updateCache] = createCache(
        {
          _initialValue: obj,
          _equal: (a, b) => a?.a === b?.a && a?.b === b?.b,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(obj, undefined);
      expect(value).toEqual({ a: 1, b: 2 });
      expect(previous).toBe(obj);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith({ a: 1, b: 2 }, obj);
      expect(value).toEqual({ a: 2, b: 3 });
      expect(previous).toEqual({ a: 1, b: 2 });
      expect(changed).toBe(true);
    });
  });

  describe('always update values', () => {
    test('creates and updates cache with alwaysUpdateValues and equal always true', () => {
      const updater = createUpdater<number | undefined>((i) => i);
      const [updateCache] = createCache<number | undefined>(
        {
          _initialValue: undefined,
          _alwaysUpdateValues: true,
          _equal: () => true,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(1, undefined);
      expect(value).toBe(2);
      expect(previous).toBe(1);
      expect(changed).toBe(false);
    });

    test('creates and updates contextual cache with alwaysUpdateValues', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const [updateCache, getCurrentCache] = createCache<ContextObj | undefined>({
        _initialValue: undefined,
        _alwaysUpdateValues: true,
      });
      const firstCtx = { test: 'test', even: 2 };

      let [value, changed, previous] = updateCache(firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(firstCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = updateCache(scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache(scndCtx, true);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(true);
    });
  });

  describe('constant', () => {
    test('updates constant initially without intial value', () => {
      const updater = createUpdater<boolean | undefined>(() => true);
      const [updateCache, getCurrentCache] = createCache<boolean | undefined>(
        {
          _initialValue: undefined,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe(true);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(true, undefined);
      expect(value).toBe(true);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('doesnt update constant with initial value', () => {
      const obj = { constant: true };
      const updater = createUpdater(() => obj);
      const [updateCache] = createCache({ _initialValue: obj }, updater);

      let [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(obj, undefined);
      expect(value).toBe(obj);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect(updater).toHaveBeenLastCalledWith(obj, undefined);
      expect(value).toBe(obj);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('updates constant with force', () => {
      const updater = createUpdater<string | undefined>(() => 'constant');
      const [updateCache, getCurrentCache] = createCache<string | undefined>(
        {
          _initialValue: undefined,
        },
        updater
      );

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith(undefined, undefined);
      expect(value).toBe('constant');
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(true);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith('constant', undefined);
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(false);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith('constant', 'constant');
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updater).toHaveBeenLastCalledWith('constant', 'constant');
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(false);
    });
  });
});
