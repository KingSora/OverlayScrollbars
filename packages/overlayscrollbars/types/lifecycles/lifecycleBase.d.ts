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
export declare const createLifecycleBase: <O>(defaultOptionsWithTemplate: OptionsWithOptionsTemplate<Required<O>>, initialOptions: O | undefined, updateFunction: (force: boolean, checkOption: LifecycleCheckOption) => any) => LifecycleBase<O>;
