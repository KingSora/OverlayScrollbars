export interface CacheValues<T> {
  readonly _value?: T;
  readonly _previous?: T;
  _changed: boolean;
}

export interface CacheOptions<T> {
  // Custom comparison function if shallow compare isn't enough. Returns true if nothing changed.
  _equal?: EqualCachePropFunction<T>;
  // Initial value for _value
  _initialValue?: T;
  // If true updates always _value and _previous, otherwise they update only when changed
  _alwaysUpdateValues?: boolean;
}

export interface Cache<T, C = undefined> {
  _current: (force?: boolean) => CacheValues<T>;
  _update: CacheUpdate<T, C>;
}

export type CacheUpdate<T, C> = undefined extends C
  ? (force?: boolean | 0, context?: C) => CacheValues<T>
  : (force: boolean | 0, context: C) => CacheValues<T>;

export type UpdateCachePropFunction<T, C> = undefined extends C
  ? (context?: C, current?: T, previous?: T) => T
  : C extends T
  ? ((context: C, current?: T, previous?: T) => T) | 0
  : (context: C, current?: T, previous?: T) => T;

export type EqualCachePropFunction<T> = (currentVal?: T, newVal?: T) => boolean;

export const createCache = <T, C = undefined>(update: UpdateCachePropFunction<T, C>, options?: CacheOptions<T>): Cache<T, C> => {
  const { _equal, _initialValue, _alwaysUpdateValues } = options || {};
  let _value: T | undefined = _initialValue;
  let _previous: T | undefined;

  const cacheUpdate = ((force?: boolean | 0, context?: C) => {
    const curr = _value;
    // @ts-ignore
    // update can only not be a function if C extends T as described in "UpdateCachePropFunction" type definition
    // if C extends T the cast (context as T) is perfectly valid
    const newVal = update ? update(context, _value, _previous) : (context as T);
    const changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

    if (changed || _alwaysUpdateValues) {
      _value = newVal;
      _previous = curr;
    }

    return {
      _value,
      _previous,
      _changed: changed,
    };
  }) as CacheUpdate<T, C>;

  return {
    _update: cacheUpdate,
    _current: (force?: boolean) => ({
      _value,
      _previous,
      _changed: !!force,
    }),
  };
};
