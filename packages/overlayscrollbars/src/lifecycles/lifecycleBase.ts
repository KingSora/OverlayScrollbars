import {
  CacheUpdateInfo,
  CachePropsToUpdate,
  CacheUpdated,
  OptionsWithOptionsTemplate,
  OptionsValidated,
  transformOptions,
  validateOptions,
  assignDeep,
  createCache,
  isEmptyObject,
  isBoolean,
} from 'support';
import { PlainObject } from 'typings';

interface LifecycleUpdateHints<O, C> {
  _force?: boolean;
  _changedOptions?: OptionsValidated<O>;
  _changedCache?: CachePropsToUpdate<C>;
}

interface AbstractLifecycle<O extends PlainObject> {
  _options(newOptions?: O): O;
  _update(force?: boolean): void;
}

export interface Lifecycle<T extends PlainObject> extends AbstractLifecycle<T> {
  _destruct(): void;
}

export interface LifecycleBase<O extends PlainObject, C extends PlainObject> extends AbstractLifecycle<O> {
  _cacheChange(cachePropsToUpdate?: CachePropsToUpdate<C>): void;
}

/**
 * Creates a object which can be seen as the base of a lifecycle because it provides all the tools to manage a lifecycle and its options, cache and base functions.
 * @param defaultOptionsWithTemplate A object which describes the options and the default options of the lifecycle.
 * @param cacheUpdateInfo A object which describes how cache updates shall behave.
 * @param initialOptions The initialOptions for the lifecylce. (Can be undefined)
 * @param updateFunction The update function where cache and options updates are handled. Has two arguments which are the changedOptions and the changedCache objects.
 */
export const createLifecycleBase = <O, C>(
  defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>,
  cacheUpdateInfo: CacheUpdateInfo<C>,
  initialOptions: O | undefined,
  updateFunction: (changedOptions: OptionsValidated<O>, changedCache: CacheUpdated<C>) => any
): LifecycleBase<O, C> => {
  const { _template: optionsTemplate, _options: defaultOptions } = transformOptions<Required<O>>(defaultOptionsWithTemplate);
  const options: Required<O> = assignDeep(
    {},
    defaultOptions,
    validateOptions<O>(initialOptions || ({} as O), optionsTemplate, null, true)._validated
  );
  const cacheChange = createCache<C>(cacheUpdateInfo);

  const update = (hints: LifecycleUpdateHints<O, C>) => {
    const hasForce = isBoolean(hints._force);
    const force = hints._force === true;

    const changedCache = cacheChange(force ? null : hints._changedCache || (hasForce ? null : []), force);
    const changedOptions = force ? options : hints._changedOptions || ({} as O);

    if (!isEmptyObject(changedOptions) || !isEmptyObject(changedCache)) {
      updateFunction(changedOptions, changedCache);
    }
  };

  update({ _force: true });

  return {
    _options(newOptions?: O) {
      if (newOptions) {
        const { _validated: changedOptions } = validateOptions(newOptions, optionsTemplate, options, true);
        assignDeep(options, changedOptions);

        update({ _changedOptions: changedOptions });
      }
      return options;
    },
    _update: (force?: boolean) => {
      update({ _force: !!force });
    },
    _cacheChange: (cachePropsToUpdate?: CachePropsToUpdate<C>) => {
      update({ _changedCache: cachePropsToUpdate });
    },
  };
};
