import { CacheUpdateInfo, CachePropsToUpdate, CacheUpdated, OptionsWithOptionsTemplate, OptionsValidated } from 'support';
import { PlainObject } from 'typings';
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
export declare const createLifecycleBase: <O, C>(defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>, cacheUpdateInfo: CacheUpdateInfo<C>, initialOptions: O | undefined, updateFunction: (changedOptions: OptionsValidated<O>, changedCache: CacheUpdated<C>) => any) => LifecycleBase<O, C>;
export {};
