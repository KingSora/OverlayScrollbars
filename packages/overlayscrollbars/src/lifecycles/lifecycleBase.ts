import {
  Cache,
  OptionsValidated,
  OptionsWithOptionsTemplate,
  transformOptions,
  validateOptions,
  assignDeep,
  hasOwnProperty,
  isEmptyObject,
} from 'support';
import { PlainObject } from 'typings';

interface LifecycleBaseUpdateHints<O> {
  _force?: boolean;
  _changedOptions?: OptionsValidated<O>;
}

export interface LifecycleBase<O extends PlainObject> {
  _options(newOptions?: O): O;
  _update(force?: boolean): void;
}

export interface Lifecycle<T extends PlainObject> extends LifecycleBase<T> {
  _destruct(): void;
  _onSizeChanged?(): void;
  _onDirectionChanged?(directionCache: Cache<boolean>): void;
  _onTrinsicChanged?(widthIntrinsic: boolean, heightIntrinsicCache: Cache<boolean>): void;
}

export interface LifecycleOptionInfo<T> {
  _value: T;
  _changed: boolean;
}

export type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;

const getPropByPath = <T>(obj: any, path: string): T =>
  obj && path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj);

/**
 * Creates a object which can be seen as the base of a lifecycle because it provides all the tools to manage a lifecycle and its options, cache and base functions.
 * @param defaultOptionsWithTemplate A object which describes the options and the default options of the lifecycle.
 * @param initialOptions The initialOptions for the lifecylce. (Can be undefined)
 * @param updateFunction The update function where cache and options updates are handled. Has two arguments which are the changedOptions and the changedCache objects.
 */
export const createLifecycleBase = <O>(
  defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>,
  initialOptions: O | undefined,
  updateFunction: (force: boolean, checkOption: LifecycleCheckOption) => any
): LifecycleBase<O> => {
  const { _template: optionsTemplate, _options: defaultOptions } = transformOptions<Required<O>>(defaultOptionsWithTemplate);
  const options: Required<O> = assignDeep(
    {},
    defaultOptions,
    validateOptions<O>(initialOptions || ({} as O), optionsTemplate, null, true)._validated
  );

  const update = (hints: LifecycleBaseUpdateHints<O>) => {
    const { _force, _changedOptions } = hints;
    const checkOption: LifecycleCheckOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: _force || getPropByPath(_changedOptions, path) !== undefined,
    });
    updateFunction(!!_force, checkOption);
  };

  update({ _force: true });

  return {
    _options(newOptions?: O) {
      if (newOptions) {
        const { _validated: _changedOptions } = validateOptions(newOptions, optionsTemplate, options, true);

        if (!isEmptyObject(_changedOptions)) {
          assignDeep(options, _changedOptions);
          update({ _changedOptions });
        }
      }
      return options;
    },
    _update: (_force?: boolean) => {
      update({ _force });
    },
  };
};
