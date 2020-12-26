import { CacheUpdateInfo, CachePropsToUpdate, Cache, OptionsWithOptionsTemplate } from 'support';
import { PlainObject } from 'typings';
interface AbstractLifecycle<O extends PlainObject> {
    _options(newOptions?: O): O;
    _update(force?: boolean): void;
}
export interface Lifecycle<T extends PlainObject> extends AbstractLifecycle<T> {
    _destruct(): void;
    _onSizeChanged?(): void;
    _onDirectionChanged?(direction: 'ltr' | 'rtl'): void;
    _onTrinsicChanged?(widthIntrinsic: boolean, heightIntrinsic: boolean): void;
}
export interface LifecycleBase<O extends PlainObject, C extends PlainObject> extends AbstractLifecycle<O> {
    _updateCache(cachePropsToUpdate?: CachePropsToUpdate<C>): void;
}
export declare const createLifecycleBase: <O, C>(defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>, cacheUpdateInfo: CacheUpdateInfo<C>, initialOptions: O | undefined, updateFunction: (options: Cache<O>, cache: Cache<C>) => any) => LifecycleBase<O, C>;
export {};
