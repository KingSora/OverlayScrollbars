export interface CacheOptions<Value> {
  // initial value of _value.
  _initialValue: Value;
  // Custom comparison function if shallow compare isn't enough. Returns true if nothing changed.
  _equal?: EqualCachePropFunction<Value>;
  // If true always updates _value and _previous, otherwise they update only when they changed.
  _alwaysUpdateValues?: boolean;
}

export type CacheValues<T> = [value: T, changed: boolean, previous?: T];

export type EqualCachePropFunction<Value> = (currentVal: Value, newVal: Value) => boolean;

export type CacheUpdater<Value> = (current: Value, previous?: Value) => Value;

export type UpdateCacheContextual<Value> = (newValue: Value, force?: boolean) => CacheValues<Value>;

export type UpdateCache<Value> = (force?: boolean) => CacheValues<Value>;

export type GetCurrentCache<Value> = (force?: boolean) => CacheValues<Value>;

export type Cache<Value> = [UpdateCache<Value>, GetCurrentCache<Value>];

export type CacheContextual<Value> = [UpdateCacheContextual<Value>, GetCurrentCache<Value>];

type CreateCache = {
  <Value>(options: CacheOptions<Value>): CacheContextual<Value>;
  <Value>(options: CacheOptions<Value>, update: CacheUpdater<Value>): Cache<Value>;
  <Value>(options: CacheOptions<Value>, update?: CacheUpdater<Value>):
    | CacheContextual<Value>
    | Cache<Value>;
};

export const createCache: CreateCache = <Value>(
  options: CacheOptions<Value>,
  update?: CacheUpdater<Value>
): CacheContextual<Value> | Cache<Value> => {
  const { _initialValue, _equal, _alwaysUpdateValues } = options;
  let _value: Value = _initialValue;
  let _previous: Value | undefined;

  const cacheUpdateContextual: UpdateCacheContextual<Value> = (newValue, force?) => {
    const curr = _value;

    const newVal = newValue;
    const changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

    if (changed || _alwaysUpdateValues) {
      _value = newVal;
      _previous = curr;
    }

    return [_value, changed, _previous];
  };
  const cacheUpdateIsolated: UpdateCache<Value> = (force?) =>
    cacheUpdateContextual(update!(_value, _previous), force);

  const getCurrentCache: GetCurrentCache<Value> = (force?: boolean) => [
    _value,
    !!force, // changed
    _previous,
  ];

  return [update ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache] as
    | CacheContextual<Value>
    | Cache<Value>;
};
