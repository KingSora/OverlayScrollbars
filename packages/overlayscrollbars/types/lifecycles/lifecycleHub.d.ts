import { XY, TRBL, CacheValues } from 'support';
import { OverlayScrollbarsOptions } from 'options';
import { StructureSetup } from 'setups/structureSetup';
import { StyleObject } from 'typings';
export declare type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;
export interface PaddingInfo {
    _absolute: boolean;
    _padding: TRBL;
}
export interface LifecycleOptionInfo<T> {
    readonly _value: T;
    _changed: boolean;
}
export interface LifecycleAdaptiveUpdateHints {
    _sizeChanged: boolean;
    _hostMutation: boolean;
    _contentMutation: boolean;
    _paddingStyleChanged: boolean;
}
export interface LifecycleUpdateHints extends LifecycleAdaptiveUpdateHints {
    _directionIsRTL: CacheValues<boolean>;
    _heightIntrinsic: CacheValues<boolean>;
}
export declare type Lifecycle = (updateHints: LifecycleUpdateHints, checkOption: LifecycleCheckOption, force: boolean) => Partial<LifecycleAdaptiveUpdateHints> | void;
export interface LifecycleHubInstance {
    _update(changedOptions?: Partial<OverlayScrollbarsOptions> | null, force?: boolean): void;
    _destroy(): void;
}
export interface LifecycleHub {
    _options: OverlayScrollbarsOptions;
    _structureSetup: StructureSetup;
    _doViewportArrange: boolean;
    _getPaddingInfo(): PaddingInfo;
    _setPaddingInfo(newPadding?: PaddingInfo | null): void;
    _getViewportPaddingStyle(): StyleObject;
    _setViewportPaddingStyle(newPaddingStlye?: StyleObject | null): void;
    _getViewportOverflowScroll(): XY<boolean>;
    _setViewportOverflowScroll(newViewportOverflowScroll: XY<boolean>): void;
}
export declare const createLifecycleHub: (options: OverlayScrollbarsOptions, structureSetup: StructureSetup) => LifecycleHubInstance;
