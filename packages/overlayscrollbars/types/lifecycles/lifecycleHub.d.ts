import { XY, WH, TRBL, CacheValues, PartialOptions } from 'support';
import { OSOptions } from 'options';
import { StructureSetup } from 'setups/structureSetup';
import { StyleObject } from 'typings';
export declare type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;
export interface LifecycleOptionInfo<T> {
    readonly _value: T;
    _changed: boolean;
}
export interface LifecycleCommunication {
    _paddingInfo: {
        _absolute: boolean;
        _padding: TRBL;
    };
    _viewportPaddingStyle: StyleObject;
    _viewportOverflowScroll: XY<boolean>;
    _viewportOverflowAmount: WH<number>;
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
export interface LifecycleHubState {
    _overflowAmount: WH<number>;
}
export interface LifecycleHubInstance {
    _update(changedOptions?: PartialOptions<OSOptions> | null, force?: boolean): void;
    _state(): LifecycleHubState;
    _destroy(): void;
}
export interface LifecycleHub {
    _options: OSOptions;
    _structureSetup: StructureSetup;
    _doViewportArrange: boolean;
    _getLifecycleCommunication(): LifecycleCommunication;
    _setLifecycleCommunication(newLifecycleCommunication?: Partial<LifecycleCommunication>): void;
}
export declare const createLifecycleHub: (options: OSOptions, structureSetup: StructureSetup) => LifecycleHubInstance;
