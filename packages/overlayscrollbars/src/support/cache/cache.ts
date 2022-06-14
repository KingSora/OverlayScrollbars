export type CacheValues<T> = [
  T, // value
  boolean, // changed
  T | undefined // previous
];

export type Cache<Value, Ctx = undefined> = [
  CacheUpdate<Value, Ctx>,
  (force?: boolean) => CacheValues<Value> // getCurrent
];

export interface CacheOptions<T> {
  // initial value of _value.
  _initialValue: T;
  // Custom comparison function if shallow compare isn't enough. Returns true if nothing changed.
  _equal?: EqualCachePropFunction<T>;
  // If true always updates _value and _previous, otherwise they update only when they changed.
  _alwaysUpdateValues?: boolean;
}

export type CacheUpdate<T, C> = undefined extends C
  ? (force?: boolean | 0, context?: C) => CacheValues<T>
  : (force: boolean | 0, context: C) => CacheValues<T>;

export type UpdateCachePropFunction<Value, Ctx> = undefined extends Ctx
  ? (context?: Ctx, current?: Value, previous?: Value) => Value
  : Ctx extends Value
  ? ((context: Ctx, current?: Value, previous?: Value) => Value) | 0
  : (context: Ctx, current?: Value, previous?: Value) => Value;

export type EqualCachePropFunction<T> = (currentVal?: T, newVal?: T) => boolean;

export const createCache = <Value, Ctx = undefined>(
  update: UpdateCachePropFunction<Value, Ctx>,
  options: CacheOptions<Value>
): Cache<Value, Ctx> => {
  const { _initialValue, _equal, _alwaysUpdateValues } = options;
  let _value: Value = _initialValue;
  let _previous: Value | undefined;

  const cacheUpdate = ((force?: boolean | 0, context?: Ctx) => {
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

    return [_value, changed, _previous];
  }) as CacheUpdate<Value, Ctx>;

  return [
    cacheUpdate,
    (force?: boolean) => [
      _value,
      !!force, // changed
      _previous,
    ],
  ];
};
