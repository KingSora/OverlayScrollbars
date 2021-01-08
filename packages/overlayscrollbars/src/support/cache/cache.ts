export interface Cache<T> {
  readonly _value?: T;
  readonly _previous?: T;
  readonly _changed: boolean;
}

export interface CacheOptions<T> {
  _equal?: EqualCachePropFunction<T>;
  _initialValue?: T;
}

export type CacheUpdate<T, C> = (force?: boolean | 0, context?: C) => Cache<T>;

export type UpdateCachePropFunction<T, C> = (context?: C, current?: T, previous?: T) => T;

export type EqualCachePropFunction<T> = (currentVal?: T, newVal?: T) => boolean;

export const createCache = <T, C = undefined>(update: UpdateCachePropFunction<T, C>, options?: CacheOptions<T>): CacheUpdate<T, C> => {
  const { _equal, _initialValue } = options || {};
  let _value: T | undefined = _initialValue;
  let _previous: T | undefined;
  return (force, context) => {
    const curr = _value;
    const newVal = update(context, _value, _previous);
    const changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

    if (changed) {
      _value = newVal;
      _previous = curr;
    }

    return {
      _value,
      _previous,
      _changed: changed,
    };
  };
};
