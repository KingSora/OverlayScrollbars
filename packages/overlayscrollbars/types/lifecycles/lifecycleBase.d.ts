import { Cache, OptionsWithOptionsTemplate } from 'support';
import { PlainObject } from 'typings';
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
export declare type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;
/**
 * Creates a object which can be seen as the base of a lifecycle because it provides all the tools to manage a lifecycle and its options, cache and base functions.
 * @param defaultOptionsWithTemplate A object which describes the options and the default options of the lifecycle.
 * @param initialOptions The initialOptions for the lifecylce. (Can be undefined)
 * @param updateFunction The update function where cache and options updates are handled. Has two arguments which are the changedOptions and the changedCache objects.
 */
export declare const createLifecycleBase: <O>(defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>, initialOptions: O | undefined, updateFunction: (force: boolean, checkOption: LifecycleCheckOption) => any) => LifecycleBase<O>;
