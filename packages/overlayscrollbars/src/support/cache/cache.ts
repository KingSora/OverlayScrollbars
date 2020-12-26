import { isArray, isString } from 'support/utils/types';
import { assignDeep, keys } from 'support/utils/object';
import { each } from 'support/utils/array';

type UpdateCacheProp<T> = <P extends keyof T>(prop: P, value: T[P], compare: EqualCachePropFunction<T, P> | null) => void;

type UpdateCachePropFunction<T, P extends keyof T> = (current?: T[P], previous?: T[P]) => T[P];

type EqualCachePropFunction<T, P extends keyof T> = (a?: T[P], b?: T[P]) => boolean;

export interface CacheEntry<T> {
  _value?: T;
  _previous?: T;
  _changed: boolean;
}

export type Cache<T> = {
  [P in keyof T]: CacheEntry<T[P]>;
};

export type CacheUpdated<T> = Cache<T> & { _anythingChanged: boolean };

export type CachePropsToUpdate<T> = Array<keyof T> | keyof T;

export type CacheUpdate<T> = (propsToUpdate?: CachePropsToUpdate<T> | null, force?: boolean) => CacheUpdated<T>;

export type CacheUpdateInfo<T> = {
  [P in keyof T]: UpdateCachePropFunction<T, P> | [UpdateCachePropFunction<T, P>, EqualCachePropFunction<T, P>];
};

/**
 * Creates a internally managed generic cache which can be updated by the returned function.
 * @param cacheUpdateInfo A object which accepts a function or a tuple of functions as values for its properties.
 * {
 *   name: updateFn,
 *   // or
 *   name: [updateFn, equalFn]
 * }
 * The first function is the update function (updateFn) which is executed when this cache prop shall be updated.
 * Two params are passed, the first one is the current cache value and the second one is the previous cache value.
 *
 * The second function is the equal function (equalFn) which is also executed when this cache prop shall be updated,
 * but returns a boolean which indicates whether the current value and the new updated value are equal.
 * If no equal function is passed a shallow comparison is carried out between the values.
 *
 * @returns A function which can be called with wither one ar an array of properties which shall be updated. Optionally it can be called with the force param.
 * This function returns a object which represents the cache and its state at the time of updating (changed to previous value, current value and previous value).
 */
export function createCache<T>(cacheUpdateInfo: CacheUpdateInfo<T>): CacheUpdate<T>;
export function createCache<T>(referenceObj: T, isReference: true): CacheUpdate<T>;
export function createCache<T>(cacheUpdateInfo: CacheUpdateInfo<T> | T, isReference?: true): CacheUpdate<T> {
  const cache: Cache<T> = {} as any;
  const allProps: Array<keyof T> = keys(cacheUpdateInfo) as Array<keyof T>;

  each(allProps, (prop) => {
    cache[prop] = { _changed: false, _value: isReference ? cacheUpdateInfo[prop] : undefined } as any;
  });

  const updateCacheProp: UpdateCacheProp<T> = (prop, value, equal): void => {
    const curr = cache[prop]._value;

    cache[prop]._value = value;
    cache[prop]._previous = curr;
    cache[prop]._changed = equal ? !equal(curr, value) : curr !== value;
  };

  const flush = (props: Array<keyof T>, force?: boolean): CacheUpdated<T> => {
    const result: CacheUpdated<T> = assignDeep({}, cache, { _anythingChanged: false });

    each(props, (prop: keyof T) => {
      const changed = force || cache[prop]._changed;
      result._anythingChanged = result._anythingChanged || changed;

      result[prop]._changed = changed;
      cache[prop]._changed = false;
    });

    return result;
  };

  return (propsToUpdate, force) => {
    const finalPropsToUpdate: Array<keyof T> =
      (isString(propsToUpdate) ? ([propsToUpdate] as Array<keyof T>) : (propsToUpdate as Array<keyof T>)) || allProps;
    each(finalPropsToUpdate, (prop) => {
      const cacheVal = cache[prop];
      const curr = cacheUpdateInfo[prop];

      const arr = isReference ? false : isArray(curr);
      const value = arr ? curr[0] : curr;
      const equal = arr ? curr[1] : null;
      updateCacheProp(prop, isReference ? value : value(cacheVal._value, cacheVal._previous), equal);
    });
    return flush(finalPropsToUpdate, force);
  };
}
