import { createCache } from 'support/cache';

const createUpdater = <T, C = unknown>(updaterReturn: (i: number) => T) => {
  const fn = jest.fn();
  let index = 0;
  const update = (context?: C, curr?: T, prev?: T): T => {
    fn(context, curr, prev);
    index += 1;
    return updaterReturn(index);
  };

  return [fn, update];
};

describe('cache', () => {
  test('creates and updates cache', () => {
    const [fn, updater] = createUpdater((i) => `${i}`);
    const _initialValue = '';
    const [updateCache, getCurrentCache] = createCache<string>(updater, {
      _initialValue,
    });

    let [value, changed, previous] = updateCache();
    expect([value, false, previous]).toEqual(getCurrentCache());
    expect(fn).toHaveBeenLastCalledWith(undefined, _initialValue, undefined);
    expect(value).toBe('1');
    expect(previous).toBe(_initialValue);
    expect(changed).toBe(true);

    [value, changed, previous] = updateCache();
    expect([value, false, previous]).toEqual(getCurrentCache());
    expect(fn).toHaveBeenLastCalledWith(undefined, '1', _initialValue);
    expect(value).toBe('2');
    expect(previous).toBe('1');
    expect(changed).toBe(true);
  });

  describe('context', () => {
    test('creates and updates cache with context', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const _initialValue = false;
      const updateFn = jest.fn();
      const updater = (context?: ContextObj, current?: boolean, previous?: boolean) => {
        updateFn(context, current, previous);
        return context!.test === 'test' || context!.even % 2 === 0;
      };
      const [updateCache, getCurrentCache] = createCache(updater, { _initialValue });
      const firstCtx = { test: 'test', even: 2 };

      let [value, changed, previous] = updateCache(0, firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updateFn).toHaveBeenLastCalledWith(firstCtx, _initialValue, undefined);
      expect(value).toBe(true);
      expect(previous).toBe(_initialValue);
      expect(changed).toBe(true);
      expect([value, false, previous]).toEqual(getCurrentCache());

      [value, changed, previous] = updateCache(0, firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updateFn).toHaveBeenLastCalledWith(firstCtx, true, _initialValue);
      expect(value).toBe(true);
      expect(previous).toBe(_initialValue);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = updateCache(0, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, true, _initialValue);
      expect(value).toBe(false);
      expect(previous).toBe(true);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(0, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, false, true);
      expect(value).toBe(false);
      expect(previous).toBe(true);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache(true, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, false, true);
      expect(value).toBe(false);
      expect(previous).toBe(false);
      expect(changed).toBe(true);
    });

    test('creates and updates cache with context shorthand', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const _initialValue = undefined;
      const firstCtx = { test: 'test', even: 2 };
      const [_update] = createCache<ContextObj | undefined, ContextObj>(0, {
        _initialValue,
      });

      let [value, changed, previous] = _update(0, firstCtx);
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = _update(0, firstCtx);
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = _update(0, scndCtx);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(true);

      [value, changed, previous] = _update(0, scndCtx);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(false);

      [value, changed, previous] = _update(true, scndCtx);
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(true);
    });
  });

  describe('equal', () => {
    test('with equal always true', () => {
      const [fn, updater] = createUpdater((i) => i);
      const [updateCache, getCurrentCache] = createCache<number | undefined>(updater, {
        _initialValue: undefined,
        _equal: () => true,
      });

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe(undefined);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe(undefined);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('with equal always false', () => {
      const [fn, updater] = createUpdater(() => 1);
      const [updateCache, getCurrentCache] = createCache<number | undefined>(updater, {
        _initialValue: undefined,
        _equal: () => false,
      });

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(1);
      expect(changed).toBe(true);
    });

    test('with object equal', () => {
      const obj = { a: -1, b: -1 };
      const [fn, updater] = createUpdater((i) => ({ a: i, b: i + 1 }));
      const [updateCache] = createCache<typeof obj | undefined>(updater, {
        _initialValue: undefined,
        _equal: (a, b) => a?.a === b?.a && a?.b === b?.b,
      });

      let [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toEqual({ a: 1, b: 2 });
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, { a: 1, b: 2 }, undefined);
      expect(value).toEqual({ a: 2, b: 3 });
      expect(previous).toEqual({ a: 1, b: 2 });
      expect(changed).toBe(true);
    });
  });

  describe('inital value', () => {
    test('creates and updates cache with initialValue', () => {
      const [fn, updater] = createUpdater((i) => i);
      const [updateCache, getCurrentCache] = createCache<number>(updater, { _initialValue: 0 });

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 0, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(0);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, 0);
      expect(value).toBe(2);
      expect(previous).toBe(1);
      expect(changed).toBe(true);
    });

    test('creates and updates cache with initialValue and equal', () => {
      const obj = { a: -1, b: -1 };
      const [fn, updater] = createUpdater((i) => ({ a: i, b: i + 1 }));
      const [updateCache] = createCache<typeof obj>(updater, {
        _initialValue: obj,
        _equal: (a, b) => a?.a === b?.a && a?.b === b?.b,
      });

      let [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(value).toEqual({ a: 1, b: 2 });
      expect(previous).toBe(obj);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, { a: 1, b: 2 }, obj);
      expect(value).toEqual({ a: 2, b: 3 });
      expect(previous).toEqual({ a: 1, b: 2 });
      expect(changed).toBe(true);
    });
  });

  describe('always update values', () => {
    test('creates and updates cache with alwaysUpdateValues and equal always true', () => {
      const [fn, updater] = createUpdater((i) => i);
      const [updateCache] = createCache<number | undefined>(updater, {
        _initialValue: undefined,
        _alwaysUpdateValues: true,
        _equal: () => true,
      });

      let [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe(1);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, undefined);
      expect(value).toBe(2);
      expect(previous).toBe(1);
      expect(changed).toBe(false);
    });

    test('creates and updates cache with context shorthand and alwaysUpdateValues', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const [updateCache, getCurrentCache] = createCache<ContextObj | undefined, ContextObj>(0, {
        _initialValue: undefined,
        _alwaysUpdateValues: true,
      });
      const firstCtx = { test: 'test', even: 2 };

      let [value, changed, previous] = updateCache(0, firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(firstCtx);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(0, firstCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(firstCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      [value, changed, previous] = updateCache(0, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(firstCtx);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(0, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache(true, scndCtx);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(value).toBe(scndCtx);
      expect(previous).toBe(scndCtx);
      expect(changed).toBe(true);
    });
  });

  describe('constant', () => {
    test('updates constant initially without intial value', () => {
      const [fn, updater] = createUpdater(() => true);
      const [updateCache, getCurrentCache] = createCache<boolean | undefined>(updater, {
        _initialValue: undefined,
      });

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe(true);
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, true, undefined);
      expect(value).toBe(true);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('doesnt update constant with initial value', () => {
      const obj = { constant: true };
      const [fn, updater] = createUpdater(() => obj);
      const [updateCache] = createCache<typeof obj>(updater, { _initialValue: obj });

      let [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(value).toBe(obj);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(value).toBe(obj);
      expect(previous).toBe(undefined);
      expect(changed).toBe(false);
    });

    test('updates constant with force', () => {
      const [fn, updater] = createUpdater(() => 'constant');
      const [updateCache, getCurrentCache] = createCache<string | undefined>(updater, {
        _initialValue: undefined,
      });

      let [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(value).toBe('constant');
      expect(previous).toBe(undefined);
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(true);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', undefined);
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(true);

      [value, changed, previous] = updateCache(false);
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', 'constant');
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(false);

      [value, changed, previous] = updateCache();
      expect([value, false, previous]).toEqual(getCurrentCache());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', 'constant');
      expect(value).toBe('constant');
      expect(previous).toBe('constant');
      expect(changed).toBe(false);
    });
  });
});
