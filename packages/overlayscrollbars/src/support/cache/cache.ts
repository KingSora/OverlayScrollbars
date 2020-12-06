import { each, keys, isArray, isString } from 'support';

interface CacheEntry<T> {
  _current?: T;
  _previous?: T;
  _changed?: boolean;
}

type Cache<T> = {
  [P in keyof T]: CacheEntry<T[P]>;
};

type UpdateCacheProp<T> = <P extends keyof T>(prop: P, value: T[P], compare: CacheEqualFunction<T, P> | null) => void;

type PropsToUpdate<T> = Array<keyof T> | keyof T;

export type CacheUpdateFunction<T, P extends keyof T> = (current?: T[P], previous?: T[P]) => T[P];

export type CacheEqualFunction<T, P extends keyof T> = (a?: T[P], b?: T[P]) => boolean;

export type CacheChanged<T> = {
  [P in keyof T]: boolean;
};

export type CacheUpdateInfo<T> = {
  [P in keyof T]: CacheUpdateFunction<T, P> | [CacheUpdateFunction<T, P>, CacheEqualFunction<T, P>];
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
 * This function returns a object which contains all cache properties as booleans which indicate whether the corresponding cache values really changed or not.
 */
export const createCache = <T>(cacheUpdateInfo: CacheUpdateInfo<T>): ((propsToUpdate?: PropsToUpdate<T>, force?: boolean) => CacheChanged<T>) => {
  const cache: Cache<T> = {} as T;
  const allProps: Array<keyof T> = keys(cacheUpdateInfo) as Array<keyof T>;

  each(allProps, (prop) => {
    cache[prop] = {};
  });

  const updateCacheProp: UpdateCacheProp<T> = (prop, value, equal): void => {
    const curr = cache[prop]._current;

    cache[prop]._current = value;
    cache[prop]._previous = curr;
    cache[prop]._changed = equal ? !equal(curr, value) : curr !== value;
  };

  const flush = (force?: boolean): CacheChanged<T> => {
    const result: CacheChanged<T> = {} as CacheChanged<T>;

    each(allProps, (prop: keyof T) => {
      result[prop] = !!(cache[prop]._changed || force);
      cache[prop]._changed = false;
    });

    return result;
  };

  return (propsToUpdate?: PropsToUpdate<T>, force?: boolean) => {
    const finalPropsToUpdate: Array<keyof T> =
      (isString(propsToUpdate) ? ([propsToUpdate] as Array<keyof T>) : (propsToUpdate as Array<keyof T>)) || allProps;
    each(finalPropsToUpdate, (prop) => {
      const cacheVal = cache[prop];
      const curr = cacheUpdateInfo[prop];
      const arr = isArray(curr);
      const value = arr ? curr[0] : curr;
      const equal = arr ? curr[1] : null;
      updateCacheProp(prop, value(cacheVal._current, cacheVal._previous), equal);
    });
    return flush(force);
  };
};
