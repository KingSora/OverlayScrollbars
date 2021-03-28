import { OptionsValidated } from 'support';
import { Options } from 'options';
import { StructureSetup } from 'setups/structureSetup';
export interface LifecycleHubInstance {
    _update(changedOptions?: OptionsValidated<Options> | null, force?: boolean): void;
    _destroy(): void;
}
export interface LifecycleHub {
    _options: Options;
    _structureSetup: StructureSetup;
}
export declare const createLifecycleHub: (options: Options, structureSetup: StructureSetup) => LifecycleHubInstance;
