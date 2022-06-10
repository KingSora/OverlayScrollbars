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
    const { _update, _current } = createCache<string>(updater);

    let { _value, _previous, _changed } = _update();
    expect({ _value, _previous, _changed: false }).toEqual(_current());
    expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
    expect(_value).toBe('1');
    expect(_previous).toBe(undefined);
    expect(_changed).toBe(true);

    ({ _value, _previous, _changed } = _update());
    expect({ _value, _previous, _changed: false }).toEqual(_current());
    expect(fn).toHaveBeenLastCalledWith(undefined, '1', undefined);
    expect(_value).toBe('2');
    expect(_previous).toBe('1');
    expect(_changed).toBe(true);
  });

  describe('context', () => {
    test('creates and updates cache with context', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const updateFn = jest.fn();
      const updater = (context?: ContextObj, current?: boolean, previous?: boolean) => {
        updateFn(context, current, previous);
        return context!.test === 'test' || context!.even % 2 === 0;
      };
      const { _update, _current } = createCache(updater);
      const firstCtx = { test: 'test', even: 2 };

      let { _value, _previous, _changed } = _update(0, firstCtx);
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(updateFn).toHaveBeenLastCalledWith(firstCtx, undefined, undefined);
      expect(_value).toBe(true);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);
      expect({ _value, _previous, _changed: false }).toEqual(_current());

      ({ _value, _previous, _changed } = _update(0, firstCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(updateFn).toHaveBeenLastCalledWith(firstCtx, true, undefined);
      expect(_value).toBe(true);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, true, undefined);
      expect(_value).toBe(false);
      expect(_previous).toBe(true);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, false, true);
      expect(_value).toBe(false);
      expect(_previous).toBe(true);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update(true, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(updateFn).toHaveBeenLastCalledWith(scndCtx, false, true);
      expect(_value).toBe(false);
      expect(_previous).toBe(false);
      expect(_changed).toBe(true);
    });

    test('creates and updates cache with context shorthand', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const { _update } = createCache<ContextObj, ContextObj>(0);
      const firstCtx = { test: 'test', even: 2 };

      let { _value, _previous, _changed } = _update(0, firstCtx);
      expect(_value).toBe(firstCtx);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(0, firstCtx));
      expect(_value).toBe(firstCtx);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(firstCtx);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(firstCtx);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update(true, scndCtx));
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(scndCtx);
      expect(_changed).toBe(true);
    });
  });

  describe('equal', () => {
    test('with equal always true', () => {
      const [fn, updater] = createUpdater((i) => i);
      const { _update, _current } = createCache<number>(updater, { _equal: () => true });

      let { _value, _previous, _changed } = _update();
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe(undefined);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update());
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe(undefined);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);
    });

    test('with equal always false', () => {
      const [fn, updater] = createUpdater(() => 1);
      const { _update, _current } = createCache<number>(updater, { _equal: () => false });

      let { _value, _previous, _changed } = _update();
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe(1);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update());
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, undefined);
      expect(_value).toBe(1);
      expect(_previous).toBe(1);
      expect(_changed).toBe(true);
    });

    test('with object equal', () => {
      const obj = { a: -1, b: -1 };
      const [fn, updater] = createUpdater((i) => ({ a: i, b: i + 1 }));
      const { _update } = createCache<typeof obj>(updater, { _equal: (a, b) => a?.a === b?.a && a?.b === b?.b });

      let { _value, _previous, _changed } = _update();
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toEqual({ a: 1, b: 2 });
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update());
      expect(fn).toHaveBeenLastCalledWith(undefined, { a: 1, b: 2 }, undefined);
      expect(_value).toEqual({ a: 2, b: 3 });
      expect(_previous).toEqual({ a: 1, b: 2 });
      expect(_changed).toBe(true);
    });
  });

  describe('inital value', () => {
    test('creates and updates cache with initialValue', () => {
      const [fn, updater] = createUpdater((i) => i);
      const { _update, _current } = createCache<number>(updater, { _initialValue: 0 });

      let { _value, _previous, _changed } = _update();
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 0, undefined);
      expect(_value).toBe(1);
      expect(_previous).toBe(0);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update());
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, 0);
      expect(_value).toBe(2);
      expect(_previous).toBe(1);
      expect(_changed).toBe(true);
    });

    test('creates and updates cache with initialValue and equal', () => {
      const obj = { a: -1, b: -1 };
      const [fn, updater] = createUpdater((i) => ({ a: i, b: i + 1 }));
      const { _update } = createCache<typeof obj>(updater, { _initialValue: obj, _equal: (a, b) => a?.a === b?.a && a?.b === b?.b });

      let { _value, _previous, _changed } = _update();
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(_value).toEqual({ a: 1, b: 2 });
      expect(_previous).toBe(obj);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update());
      expect(fn).toHaveBeenLastCalledWith(undefined, { a: 1, b: 2 }, obj);
      expect(_value).toEqual({ a: 2, b: 3 });
      expect(_previous).toEqual({ a: 1, b: 2 });
      expect(_changed).toBe(true);
    });
  });

  describe('always update values', () => {
    test('creates and updates cache with alwaysUpdateValues and equal always true', () => {
      const [fn, updater] = createUpdater((i) => i);
      const { _update } = createCache<number>(updater, { _alwaysUpdateValues: true, _equal: () => true });

      let { _value, _previous, _changed } = _update();
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe(1);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update());
      expect(fn).toHaveBeenLastCalledWith(undefined, 1, undefined);
      expect(_value).toBe(2);
      expect(_previous).toBe(1);
      expect(_changed).toBe(false);
    });

    test('creates and updates cache with context shorthand and alwaysUpdateValues', () => {
      interface ContextObj {
        test: string;
        even: number;
      }
      const { _update, _current } = createCache<ContextObj, ContextObj>(0, { _alwaysUpdateValues: true });
      const firstCtx = { test: 'test', even: 2 };

      let { _value, _previous, _changed } = _update(0, firstCtx);
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(_value).toBe(firstCtx);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(0, firstCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(_value).toBe(firstCtx);
      expect(_previous).toBe(firstCtx);
      expect(_changed).toBe(false);

      const scndCtx = { test: 'nah', even: 1 };

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(firstCtx);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(0, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(scndCtx);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update(true, scndCtx));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(_value).toBe(scndCtx);
      expect(_previous).toBe(scndCtx);
      expect(_changed).toBe(true);
    });
  });

  describe('constant', () => {
    test('updates constant initially without intial value', () => {
      const [fn, updater] = createUpdater(() => true);
      const { _update, _current } = createCache<boolean>(updater);

      let { _value, _previous, _changed } = _update();
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe(true);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update());
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, true, undefined);
      expect(_value).toBe(true);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);
    });

    test('doesnt update constant with initial value', () => {
      const obj = { constant: true };
      const [fn, updater] = createUpdater(() => obj);
      const { _update } = createCache<typeof obj>(updater, { _initialValue: obj });

      let { _value, _previous, _changed } = _update();
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(_value).toBe(obj);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update());
      expect(fn).toHaveBeenLastCalledWith(undefined, obj, undefined);
      expect(_value).toBe(obj);
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(false);
    });

    test('updates constant with force', () => {
      const [fn, updater] = createUpdater(() => 'constant');
      const { _update, _current } = createCache<string>(updater);

      let { _value, _previous, _changed } = _update();
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, undefined, undefined);
      expect(_value).toBe('constant');
      expect(_previous).toBe(undefined);
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(true));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', undefined);
      expect(_value).toBe('constant');
      expect(_previous).toBe('constant');
      expect(_changed).toBe(true);

      ({ _value, _previous, _changed } = _update(false));
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', 'constant');
      expect(_value).toBe('constant');
      expect(_previous).toBe('constant');
      expect(_changed).toBe(false);

      ({ _value, _previous, _changed } = _update());
      expect({ _value, _previous, _changed: false }).toEqual(_current());
      expect(fn).toHaveBeenLastCalledWith(undefined, 'constant', 'constant');
      expect(_value).toBe('constant');
      expect(_previous).toBe('constant');
      expect(_changed).toBe(false);
    });
  });
});
